import {
  writeFile,
  readFile,
  mkdtemp,
  rename,
  chmod,
  mkdir,
  stat,
  rm,
} from 'node:fs/promises'
import { onTestFinished, describe, expect, it, vi } from 'vitest'
import { basename, join } from 'node:path'
import { tmpdir } from 'node:os'

import { runEvaluations } from '../scripts/lib/run-evaluations.js'

vi.mock(import('node:fs/promises'), async importOriginal => {
  let actual = await importOriginal()
  return {
    ...actual,
    mkdtemp: vi.fn(actual.mkdtemp),
    rename: vi.fn(actual.rename),
    rm: vi.fn(actual.rm),
  }
})

const LIVE = { timeout: 30_000 }

async function fakeRuntime(mode = 'success') {
  let directory = await mkdtemp(join(tmpdir(), 'evaluation-failures-'))
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  let binaries = join(directory, 'bin')
  await mkdir(binaries)
  let log = join(directory, 'calls.jsonl')
  let output = join(directory, 'results')
  let executable = join(binaries, 'codex')
  await writeFile(
    executable,
    String.raw`#!${process.execPath}
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
const flags = '--json --ephemeral --ignore-user-config --skip-git-repo-check --sandbox --model --config --enable --disable --output-last-message --output-schema';
if (args.includes('--version')) console.log('codex-cli fake');
else if (args.includes('--help')) console.log(flags);
else if (args[0] === 'features') for (const name of ['skip_host_skill_discovery','plugins','apps','memories','multi_agent']) console.log(name + ' stable false');
else {
  process.stdin.resume();
  process.stdin.on('end', () => {
    const response = args[args.indexOf('--output-last-message') + 1];
    const phase = args.includes('--output-schema') ? 'grader' : 'writer';
    fs.appendFileSync(${JSON.stringify(log)}, JSON.stringify({ phase, cwd: process.cwd() }) + '\n');
    if (${JSON.stringify(mode)} === 'flaky' && phase === 'writer' && !fs.existsSync(path.dirname(response) + '.failed-1')) {
      console.log(JSON.stringify({ type: 'turn.failed', error: { message: 'Fake infrastructure failure.' } }));
      process.exitCode = 1;
      return;
    }
    let answer = 'Writer response.';
    if (phase === 'grader') {
      const schema = JSON.parse(fs.readFileSync(args[args.indexOf('--output-schema') + 1], 'utf8'));
      const verdict = { pass: true, evidence: 'Given facts remain.' };
      answer = JSON.stringify({ expectations: Array.from({ length: schema.properties.expectations.minItems }, (_, index) => ({ index, ...verdict })), factualIntegrity: verdict, scope: verdict, readability: Object.fromEntries(['clarity','order','economy','voice'].map(key => [key, { score: 2, evidence: 'Clear text.' }])) });
    }
    fs.writeFileSync(response, answer);
    console.log(JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 10, output_tokens: 5 } }));
  });
}
`,
  )
  await chmod(executable, 0o755)
  onTestFinished(() => vi.unstubAllEnvs())
  vi.stubEnv('CODEX_HOME', join(directory, '.codex'))
  vi.stubEnv('PATH', binaries)
  vi.stubEnv('HOME', directory)
  let info = vi.spyOn(console, 'info').mockImplementation(() => {})
  onTestFinished(() => info.mockRestore())
  return {
    start(arguments_ = [], options = {}) {
      return runEvaluations(
        [
          '--case',
          '33',
          '--variant',
          'none',
          '--model',
          'writer-model',
          '--output',
          output,
          ...arguments_,
        ],
        options,
      )
    },
    result(repeat) {
      return readJson(
        join(output, 'case-33', 'none', `run-${repeat}`, 'result.json'),
      )
    },
    summary() {
      return readJson(join(output, 'summary.json'))
    },
    calls() {
      return readCalls(log)
    },
    output,
  }
}

async function failRename(suffix) {
  let actual = await vi.importActual('node:fs/promises')
  onTestFinished(() => vi.mocked(rename).mockReset())
  vi.mocked(rename).mockImplementation((from, to) => {
    if (to.endsWith(suffix)) {
      let error = new Error('EPERM: operation not permitted, rename')
      return Promise.reject(Object.assign(error, { code: 'EPERM' }))
    }
    return actual.rename(from, to)
  })
}

// Removes the target like rm does, then reports that removal failed.
async function failNextRm() {
  let actual = await vi.importActual('node:fs/promises')
  onTestFinished(() => vi.mocked(rm).mockReset())
  vi.mocked(rm).mockClear()
  vi.mocked(rm).mockImplementationOnce(async (target, options) => {
    await actual.rm(target, options)
    throw new Error('EBUSY: resource busy or locked')
  })
}

async function readCalls(filename) {
  try {
    return (await readFile(filename, 'utf8'))
      .trim()
      .split('\n')
      .map(line => JSON.parse(line))
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

async function readJson(filename) {
  return JSON.parse(await readFile(filename, 'utf8'))
}

describe('run-evaluations failures', () => {
  it(
    'a writer workspace that cannot be removed marks the trial cleanup_failed',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      await failNextRm()
      await expect(runtime.start()).resolves.toBe(1)
      let record = await runtime.result(1)
      expect(record).toMatchObject({
        error: 'Workspace cleanup failed: EBUSY: resource busy or locked',
        cleanupError: 'EBUSY: resource busy or locked',
        writerStatus: 'completed',
        status: 'cleanup_failed',
      })
      let [writer] = await runtime.calls()
      let [[workspace, options]] = vi.mocked(rm).mock.calls
      expect(basename(workspace)).toBe(basename(writer.cwd))
      expect(options).toStrictEqual({ recursive: true, force: true })
      await expect(stat(writer.cwd)).rejects.toMatchObject({ code: 'ENOENT' })
      let summary = await runtime.summary()
      expect(summary.execution.stopReason).toBe(record.error)
      expect(summary.variants.none.infrastructureErrors).toBe(1)
    },
  )

  it(
    'a grader workspace that cannot be removed keeps the grade and marks the trial cleanup_failed',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      await failNextRm()
      await expect(
        runtime.start(['--grade', '--grader-model', 'grader-model']),
      ).resolves.toBe(1)
      let record = await runtime.result(1)
      expect(record).toMatchObject({
        error:
          'Grader workspace cleanup failed: EBUSY: resource busy or locked',
        cleanupError: 'EBUSY: resource busy or locked',
        gradingRun: { status: 'completed' },
        writerStatus: 'completed',
        status: 'cleanup_failed',
      })
      expect(record.grade.pass).toBe(true)
      let calls = await runtime.calls()
      expect(calls.map(call => call.phase)).toStrictEqual(['writer', 'grader'])
      expect(
        vi.mocked(rm).mock.calls.map(([target]) => basename(target)),
      ).toStrictEqual([basename(calls[1].cwd), basename(calls[0].cwd)])
      await Promise.all(
        calls.map(call =>
          expect(stat(call.cwd)).rejects.toMatchObject({ code: 'ENOENT' }),
        ),
      )
      let summary = await runtime.summary()
      expect(summary.variants.none.availableGrades).toBe(1)
    },
  )

  it(
    'a grader workspace that cannot be created fails grading and keeps the writer response',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      let actual = await vi.importActual('node:fs/promises')
      onTestFinished(() => vi.mocked(mkdtemp).mockReset())
      vi.mocked(mkdtemp)
        .mockImplementationOnce(actual.mkdtemp)
        .mockRejectedValueOnce(
          new Error('EMFILE: too many open files, mkdtemp'),
        )
      await expect(
        runtime.start(['--grade', '--grader-model', 'grader-model']),
      ).resolves.toBe(1)
      let record = await runtime.result(1)
      expect(record).toMatchObject({
        error: 'EMFILE: too many open files, mkdtemp',
        writerStatus: 'completed',
        status: 'grading_failed',
      })
      expect('gradingRun' in record).toBe(false)
      expect(vi.mocked(mkdtemp).mock.calls.at(-1)[0]).toBe(
        join(tmpdir(), 'ghostwriter-grade-'),
      )
      await expect(
        readFile(
          join(runtime.output, 'case-33', 'none', 'run-1', 'response.md'),
          'utf8',
        ),
      ).resolves.toBe('Writer response.')
      let calls = await runtime.calls()
      expect(calls.map(call => call.phase)).toStrictEqual(['writer'])
    },
  )

  it(
    'a trial interrupted while its workspace is created is saved as aborted',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      let controller = new AbortController()
      onTestFinished(() => vi.mocked(mkdtemp).mockReset())
      vi.mocked(mkdtemp).mockImplementationOnce(() => {
        controller.abort()
        return Promise.reject(new Error('EMFILE: too many open files, mkdtemp'))
      })
      await expect(
        runtime.start(['--runs', '2'], { signal: controller.signal }),
      ).resolves.toBe(1)
      await expect(runtime.result(1)).resolves.toMatchObject({
        error: 'EMFILE: too many open files, mkdtemp',
        status: 'aborted',
      })
      let summary = await runtime.summary()
      expect(summary.execution).toMatchObject({
        stopReason: 'Interrupted by signal.',
        finished: 1,
        skipped: 1,
      })
      await expect(
        readJson(join(runtime.output, 'skipped.json')),
      ).resolves.toMatchObject([
        { reason: 'Interrupted by signal.', caseId: 33, repeat: 2 },
      ])
      await expect(runtime.calls()).resolves.toStrictEqual([])
    },
  )

  it(
    'a failed attempt that cannot be set aside fails the trial without a retry',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('flaky')
      await failRename('.failed-1')
      await expect(runtime.start(['--retries', '1'])).resolves.toBe(1)
      let record = await runtime.result(1)
      expect(record).toMatchObject({
        error: 'EPERM: operation not permitted, rename',
        failedAttempts: [],
        status: 'failed',
      })
      await expect(runtime.calls()).resolves.toHaveLength(1)
      await stat(
        join(runtime.output, 'case-33', 'none', 'run-1', 'trace.jsonl'),
      )
    },
  )

  it(
    'a trial result that cannot be saved stops the run with the error',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      await failRename('result.json')
      await expect(runtime.start(['--runs', '2'])).rejects.toThrow(
        'EPERM: operation not permitted, rename',
      )
      await expect(runtime.result(1)).rejects.toMatchObject({ code: 'ENOENT' })
      let summary = await runtime.summary()
      expect(summary.execution).toMatchObject({
        stopReason:
          'Cannot save trial result: EPERM: operation not permitted, rename',
        finished: 1,
        skipped: 1,
      })
      expect(summary.variants.none.total).toBe(1)
      await expect(runtime.calls()).resolves.toHaveLength(1)
    },
  )
})
