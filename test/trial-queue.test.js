import { describe, expect, it, vi } from 'vitest'

import { runTrialQueue } from '../scripts/lib/trial-queue.js'

async function failFirstTrial(trial, signal) {
  if (trial === 1) {
    await delay(20)
    return { error: 'Infrastructure failure.', status: 'failed' }
  }
  await waitForAbort(signal)
  return { status: 'aborted', error: 'Aborted.' }
}

function abortOnSecondTrial(controller) {
  return async (trial, signal) => {
    if (trial === 2) {
      setTimeout(() => controller.abort(), 5)
    }
    await waitForAbort(signal)
    return { status: 'aborted' }
  }
}

async function failFirstThenThrowOnAbort(trial, signal) {
  if (trial === 1) {
    await delay(20)
    return { error: 'Infrastructure failure.', status: 'failed' }
  }
  return throwAfterAbort(trial, signal)
}

async function crashFirstTrial(trial) {
  await delay(1)
  if (trial === 1) {
    throw new Error('Codex crashed.')
  }
  return { status: 'completed' }
}

function recordInto(saved) {
  return async (trial, record, progress) => {
    saved.push({ progress, record, trial })
    await delay(1)
  }
}

function waitForAbort(signal) {
  return new Promise(resolve => {
    signal.addEventListener('abort', resolve, { once: true })
  })
}

async function throwAfterAbort(trial, signal) {
  await waitForAbort(signal)
  throw new Error(`Process ${trial} killed.`)
}

async function failFirstSave(trial) {
  await delay(1)
  if (trial === 1) {
    throw new Error('Disk is full.')
  }
}

function delay(milliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds)
  })
}

function completeTrial(trial) {
  return Promise.resolve({ status: 'completed', trial })
}

function trialDuration(trial) {
  return trial === 1 ? 40 : 10
}

describe('runTrialQueue', () => {
  it('runs more than one trial but never exceeds jobs and serializes persistence', async () => {
    let active = 0
    let maximum = 0
    let saving = 0
    let saved = []
    let result = await runTrialQueue({
      async runTrial(trial) {
        active++
        maximum = Math.max(maximum, active)
        await delay(trialDuration(trial))
        active--
        return { status: 'completed', trial }
      },
      async onResult(trial, record) {
        expect(saving++).toBe(0)
        await delay(5)
        saved.push(record.trial)
        saving--
      },
      trials: [1, 2, 3, 4, 5],
      jobs: 2,
    })
    expect(maximum).toBe(2)
    expect(saved.toSorted()).toStrictEqual([1, 2, 3, 4, 5])
    expect(result.execution.finished).toBe(5)
    expect(result.execution.skipped).toBe(0)
  })

  it('a fatal failure stops queued work, aborts active work, and saves every started trial', async () => {
    let saved = []
    let started = []
    let result = await runTrialQueue({
      async onResult(trial, record) {
        saved.push({ status: record.status, trial })
        await delay(1)
      },
      runTrial(trial, signal) {
        started.push(trial)
        return failFirstTrial(trial, signal)
      },
      trials: [1, 2, 3, 4],
      jobs: 2,
    })
    expect(started).toStrictEqual([1, 2])
    expect(saved).toHaveLength(2)
    expect(result.skipped).toStrictEqual([3, 4])
    expect(result.execution.started).toBe(result.execution.finished)
    expect(result.execution.skipped).toBe(2)
  })

  it('external cancellation saves active records and reports queued trials separately', async () => {
    let controller = new AbortController()
    let saved = []
    let result = await runTrialQueue({
      async onResult(trial) {
        saved.push(trial)
        await delay(1)
      },
      runTrial: abortOnSecondTrial(controller),
      signal: controller.signal,
      trials: [1, 2, 3],
      jobs: 2,
    })
    expect(saved.toSorted()).toStrictEqual([1, 2])
    expect(result.skipped).toStrictEqual([3])
    expect(result.execution.stopReason).toBe('Interrupted by signal.')
  })

  it('a persistence failure still attempts to save other started trials', async () => {
    let attempted = []
    let result = await runTrialQueue({
      onResult(trial) {
        attempted.push(trial)
        return failFirstSave(trial)
      },
      async runTrial() {
        await delay(5)
        return { status: 'completed' }
      },
      trials: [1, 2, 3],
      jobs: 2,
    })
    expect(attempted).toStrictEqual([1, 2])
    expect(result.persistenceErrors).toHaveLength(1)
    expect(result.skipped).toStrictEqual([3])
  })

  it.each([
    ['zero', 0],
    ['a negative number', -1],
    ['a fraction', 1.5],
    ['NaN', Number.NaN],
    ['infinity', Infinity],
    ['an unsafe integer', 2 ** 53],
    ['a numeric string', '2'],
    ['null', null],
  ])('rejects %s as jobs before starting any trial', async (_, jobs) => {
    let controller = new AbortController()
    let addListener = vi.spyOn(controller.signal, 'addEventListener')
    let runTrial = vi.fn()
    let onResult = vi.fn()
    await expect(
      runTrialQueue({
        signal: controller.signal,
        trials: [1, 2],
        onResult,
        runTrial,
        jobs,
      }),
    ).rejects.toThrow(new Error('jobs must be a positive integer.'))
    expect(runTrial).not.toHaveBeenCalled()
    expect(onResult).not.toHaveBeenCalled()
    expect(addListener).not.toHaveBeenCalled()
    addListener.mockRestore()
  })

  it('runs one trial at a time when jobs is omitted', async () => {
    let active = 0
    let maximum = 0
    let saved = []
    let result = await runTrialQueue({
      async runTrial(trial) {
        active++
        maximum = Math.max(maximum, active)
        await delay(trialDuration(trial))
        active--
        return { status: 'completed', trial }
      },
      async onResult(trial) {
        saved.push(trial)
        await delay(1)
      },
      trials: [1, 2, 3],
    })
    expect(maximum).toBe(1)
    expect(saved).toStrictEqual([1, 2, 3])
    expect(result).toStrictEqual({
      execution: {
        stopReason: null,
        finished: 3,
        planned: 3,
        running: 0,
        skipped: 0,
        started: 3,
        queued: 0,
        jobs: 1,
      },
      persistenceErrors: [],
      skipped: [],
    })
  })

  it('passes a progress snapshot with every saved record', async () => {
    let saved = []
    await runTrialQueue({
      onResult: recordInto(saved),
      runTrial: completeTrial,
      trials: ['a', 'b'],
    })
    expect(saved).toStrictEqual([
      {
        progress: {
          stopReason: null,
          finished: 1,
          planned: 2,
          running: 0,
          skipped: 0,
          started: 1,
          queued: 1,
          jobs: 1,
        },
        record: { status: 'completed', trial: 'a' },
        trial: 'a',
      },
      {
        progress: {
          stopReason: null,
          finished: 2,
          planned: 2,
          running: 0,
          skipped: 0,
          started: 2,
          queued: 0,
          jobs: 1,
        },
        record: { status: 'completed', trial: 'b' },
        trial: 'b',
      },
    ])
  })

  it('returns an empty execution when there are no trials', async () => {
    let runTrial = vi.fn()
    let onResult = vi.fn()
    let result = await runTrialQueue({
      trials: [],
      onResult,
      runTrial,
      jobs: 3,
    })
    expect(runTrial).not.toHaveBeenCalled()
    expect(onResult).not.toHaveBeenCalled()
    expect(result).toStrictEqual({
      execution: {
        stopReason: null,
        finished: 0,
        planned: 0,
        running: 0,
        skipped: 0,
        started: 0,
        queued: 0,
        jobs: 3,
      },
      persistenceErrors: [],
      skipped: [],
    })
  })

  it('skips every trial when the signal is already aborted', async () => {
    let controller = new AbortController()
    controller.abort()
    let runTrial = vi.fn()
    let onResult = vi.fn()
    let result = await runTrialQueue({
      signal: controller.signal,
      trials: [1, 2, 3],
      onResult,
      runTrial,
      jobs: 2,
    })
    expect(runTrial).not.toHaveBeenCalled()
    expect(onResult).not.toHaveBeenCalled()
    expect(result).toStrictEqual({
      execution: {
        stopReason: 'Interrupted by signal.',
        finished: 0,
        planned: 3,
        running: 0,
        skipped: 3,
        started: 0,
        queued: 0,
        jobs: 2,
      },
      persistenceErrors: [],
      skipped: [1, 2, 3],
    })
  })

  it('removes its abort listener once the queue settles', async () => {
    let controller = new AbortController()
    let addListener = vi.spyOn(controller.signal, 'addEventListener')
    let removeListener = vi.spyOn(controller.signal, 'removeEventListener')
    let result = await runTrialQueue({
      signal: controller.signal,
      runTrial: completeTrial,
      onResult: vi.fn(),
      trials: [1],
    })
    expect(addListener).toHaveBeenCalledExactlyOnceWith(
      'abort',
      expect.any(Function),
      { once: true },
    )
    expect(removeListener).toHaveBeenCalledExactlyOnceWith(
      'abort',
      addListener.mock.calls[0][1],
    )
    expect(result.execution.stopReason).toBeNull()
    addListener.mockRestore()
    removeListener.mockRestore()
  })

  it('saves a thrown trial as failed and stops with its message', async () => {
    let saved = []
    let result = await runTrialQueue({
      onResult: recordInto(saved),
      runTrial: crashFirstTrial,
      trials: [1, 2, 3],
    })
    expect(saved).toStrictEqual([
      {
        progress: {
          stopReason: 'Codex crashed.',
          finished: 1,
          planned: 3,
          running: 0,
          skipped: 2,
          started: 1,
          queued: 0,
          jobs: 1,
        },
        record: { error: 'Codex crashed.', status: 'failed' },
        trial: 1,
      },
    ])
    expect(result.skipped).toStrictEqual([2, 3])
    expect(result.execution.stopReason).toBe('Codex crashed.')
    expect(result.persistenceErrors).toStrictEqual([])
  })

  it('saves a trial that throws after a fatal failure as aborted', async () => {
    let saved = []
    let result = await runTrialQueue({
      runTrial: failFirstThenThrowOnAbort,
      onResult: recordInto(saved),
      trials: [1, 2, 3],
      jobs: 2,
    })
    expect(saved.map(({ record, trial }) => ({ record, trial }))).toStrictEqual(
      [
        {
          record: { error: 'Infrastructure failure.', status: 'failed' },
          trial: 1,
        },
        {
          record: { error: 'Process 2 killed.', status: 'aborted' },
          trial: 2,
        },
      ],
    )
    expect(result.skipped).toStrictEqual([3])
    expect(result.execution.stopReason).toBe('Infrastructure failure.')
  })

  it('saves trials that throw after external cancellation as aborted', async () => {
    let controller = new AbortController()
    let saved = []
    setTimeout(() => controller.abort(), 5)
    let result = await runTrialQueue({
      onResult: recordInto(saved),
      signal: controller.signal,
      runTrial: throwAfterAbort,
      trials: [1, 2, 3],
      jobs: 2,
    })
    expect(saved.map(({ record, trial }) => ({ record, trial }))).toStrictEqual(
      [
        { record: { error: 'Process 1 killed.', status: 'aborted' }, trial: 1 },
        { record: { error: 'Process 2 killed.', status: 'aborted' }, trial: 2 },
      ],
    )
    expect(result.skipped).toStrictEqual([3])
    expect(result.execution).toStrictEqual({
      stopReason: 'Interrupted by signal.',
      finished: 2,
      planned: 3,
      running: 0,
      skipped: 1,
      started: 2,
      queued: 0,
      jobs: 2,
    })
  })

  it('stops with the trial status when a trial ends without an error', async () => {
    let saved = []
    let result = await runTrialQueue({
      runTrial: () => Promise.resolve({ status: 'timeout' }),
      onResult: recordInto(saved),
      trials: [1, 2],
    })
    expect(saved.map(({ record, trial }) => ({ record, trial }))).toStrictEqual(
      [{ record: { status: 'timeout' }, trial: 1 }],
    )
    expect(result.skipped).toStrictEqual([2])
    expect(result.execution.stopReason).toBe('Trial ended with timeout.')
  })

  it('reports which trial could not be saved and why', async () => {
    let result = await runTrialQueue({
      onResult: failFirstSave,
      runTrial: completeTrial,
      trials: [1, 2, 3],
    })
    expect(result).toStrictEqual({
      execution: {
        stopReason: 'Cannot save trial result: Disk is full.',
        finished: 1,
        planned: 3,
        running: 0,
        skipped: 2,
        started: 1,
        queued: 0,
        jobs: 1,
      },
      persistenceErrors: [{ error: 'Disk is full.', trial: 1 }],
      skipped: [2, 3],
    })
  })
})
