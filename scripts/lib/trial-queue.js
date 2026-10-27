/**
 * Run bounded trials and serialize their completion records. A failed trial
 * stops new work and aborts every active trial before their records are saved.
 *
 * @param {object} options - Trials, worker and persistence callbacks, and
 *   cancellation.
 * @returns {Promise<object>} Final queue state, skipped trials, and persistence
 *   errors.
 */
export async function runTrialQueue({
  jobs = 1,
  runTrial,
  onResult,
  trials,
  signal,
}) {
  if (!Number.isSafeInteger(jobs) || jobs < 1) {
    throw new Error('jobs must be a positive integer.')
  }
  let controller = new AbortController()
  let next = 0
  let finished = 0
  let stopReason = null
  let persistence = Promise.resolve()
  let persistenceErrors = []

  function stop(reason) {
    stopReason ??= reason
    controller.abort()
  }
  function interrupted() {
    stop('Interrupted by signal.')
  }
  function progress() {
    return {
      skipped: stopReason ? trials.length - next : 0,
      queued: stopReason ? 0 : trials.length - next,
      running: next - finished,
      planned: trials.length,
      started: next,
      stopReason,
      finished,
      jobs,
    }
  }
  signal?.addEventListener('abort', interrupted, { once: true })
  if (signal?.aborted) {
    interrupted()
  }

  function persistResult(trial, result) {
    let previous = persistence
    async function save() {
      await previous
      finished++
      try {
        await onResult(trial, result, progress())
      } catch (error) {
        persistenceErrors.push({ error: error.message, trial })
        stop(`Cannot save trial result: ${error.message}`)
      }
    }
    persistence = save()
    return persistence
  }

  async function worker() {
    if (controller.signal.aborted || next >= trials.length) {
      return
    }
    let trial = trials[next++]
    // Each active trial gets its own signal, including its CLI preflight.
    let trialSignal = AbortSignal.any([controller.signal])
    let result
    try {
      result = await runTrial(trial, trialSignal)
    } catch (error) {
      result = {
        status: trialSignal.aborted ? 'aborted' : 'failed',
        error: error.message,
      }
    }
    if (result.status !== 'completed') {
      stop(result.error || `Trial ended with ${result.status}.`)
    }
    await persistResult(trial, result)
    // Each worker finishes and saves its trial before taking another.
    await worker()
  }
  try {
    await Promise.all(
      Array.from({ length: Math.min(jobs, trials.length) }, () => worker()),
    )
    await persistence
  } finally {
    signal?.removeEventListener('abort', interrupted)
  }
  return {
    skipped: trials.slice(next),
    execution: progress(),
    persistenceErrors,
  }
}
