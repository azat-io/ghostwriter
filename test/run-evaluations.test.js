import {
  writeFile,
  readFile,
  realpath,
  symlink,
  mkdtemp,
  readdir,
  chmod,
  mkdir,
  stat,
  cp,
  rm,
} from 'node:fs/promises'
import { onTestFinished, onTestFailed, describe, expect, it, vi } from 'vitest'
import { spawnSync, spawn } from 'node:child_process'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

import { runEvaluations } from '../scripts/lib/run-evaluations.js'

const SCRIPT = fileURLToPath(
  new URL('../scripts/run-evaluations.js', import.meta.url),
)
const ROOT = fileURLToPath(new URL('../', import.meta.url))
const LIVE = { timeout: 30_000 }
const OUTDATED =
  'Installed Codex CLI lacks required options/features: --output-schema.'

async function fakeRuntime(mode = 'success', { input = null, root } = {}) {
  let directory = await mkdtemp(join(tmpdir(), 'evaluation-jobs-'))
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  let binaries = join(directory, 'bin')
  await mkdir(binaries)
  let log = join(directory, 'calls.jsonl')
  let modeFile = join(directory, 'mode')
  let output = join(directory, 'results')
  let executable = join(binaries, 'codex')
  await writeFile(
    executable,
    String.raw`#!${process.execPath}
const fs = require('node:fs');
const path = require('node:path');
const args = process.argv.slice(2);
const modeFile = ${JSON.stringify(modeFile)};
const mode = fs.existsSync(modeFile) ? fs.readFileSync(modeFile, 'utf8') : ${JSON.stringify(mode)};
const log = ${JSON.stringify(log)};
const input = ${JSON.stringify(input)};
if (mode === 'offline') {
  fs.writeFileSync(path.join(path.dirname(log), 'codex-was-invoked'), 'Unexpected invocation');
  process.exit(97);
}
const flags = ['--json', '--ephemeral', '--ignore-user-config', '--skip-git-repo-check', '--sandbox', '--model', '--config', '--enable', '--disable', '--output-last-message', '--output-schema'];
if (args.includes('--version')) console.log('codex-cli fake');
else if (args.includes('--help')) console.log(flags.filter(flag => mode !== 'outdated' || flag !== '--output-schema').join(' '));
else if (args[0] === 'features') for (const name of ['skip_host_skill_discovery','plugins','apps','memories','multi_agent']) console.log(name + ' stable false');
else {
  let prompt = '';
  process.stdin.on('data', chunk => { prompt += chunk; });
  process.stdin.on('end', () => {
    const response = args[args.indexOf('--output-last-message') + 1];
    const phase = args.includes('--output-schema') ? 'grader' : 'writer';
    const trial = phase === 'grader' ? path.dirname(path.dirname(response)) : path.dirname(response);
    const caseId = path.basename(path.dirname(path.dirname(trial)));
    const run = path.basename(trial);
    const read = file => fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
    const skill = read(path.join('skill', 'ghostwriter', 'SKILL.md'));
    const info = {
      phase,
      trial,
      cwd: process.cwd(),
      model: args[args.indexOf('--model') + 1],
      effort: args.find(value => value.startsWith('model_reasoning_effort=')),
      disabled: args.find(value => value.startsWith('skills.config=')) ?? null,
      input: read(path.join('inputs', 'notes.md')),
      skill: skill && skill.split('\n').slice(0, 4).join('\n'),
    };
    const record = event => fs.appendFileSync(log, JSON.stringify({ event, ...info }) + '\n');
    record('start');
    process.on('SIGTERM', () => { record('abort'); process.exit(0); });
    if (mode === 'delete-input' && phase === 'writer') fs.rmSync(input);
    const firstAttempt = !fs.existsSync(phase === 'grader' ? path.join(trial, 'grading.failed-1') : trial + '.failed-1');
    const first = caseId === 'case-33' && run === 'run-1';
    const last = caseId === 'case-34' && run === 'run-2';
    const failing = (mode === 'failure' && first) || (mode === 'flaky' && phase === 'writer' && first && firstAttempt) || (mode === 'fail-last' && phase === 'writer' && last) || (mode === 'fail-last-grader' && phase === 'grader' && last);
    const invalid = mode === 'flaky' && phase === 'grader' && caseId === 'case-34' && run === 'run-1' && firstAttempt;
    const hang = mode === 'hang' || (mode === 'failure' && !failing) || (mode === 'hang-grader' && phase === 'grader');
    const timeout = hang ? 10000 : failing ? 100 : 350;
    setTimeout(() => {
      if (failing) {
        record('finish');
        console.log(JSON.stringify({ type: 'turn.failed', error: { message: 'Fake infrastructure failure.' } }));
        process.exitCode = 1;
        return;
      }
      const reads = { 'case-1': 'cat skill/ghostwriter/SKILL.md', 'case-12': 'cat skill/ghostwriter/SKILL.md', 'case-2': 'python3 read.py skill/ghostwriter/SKILL.md' };
      if (mode === 'triggers' && reads[caseId]) {
        console.log(JSON.stringify({ type: 'item.completed', item: { id: 'read', type: 'command_execution', command: reads[caseId], status: 'completed', exit_code: 0, aggregated_output: skill } }));
      }
      let answer = 'Writer response.';
      if (invalid) {
        answer = 'Not a grade.';
      } else if (phase === 'grader') {
        const schema = JSON.parse(fs.readFileSync(args[args.indexOf('--output-schema') + 1], 'utf8'));
        const count = schema.properties.expectations.minItems;
        const verdict = { pass: true, evidence: 'Given facts remain.' };
        const factualIntegrity = mode === 'reject' ? { pass: false, evidence: 'The import time changed.' } : verdict;
        answer = JSON.stringify({ expectations: Array.from({ length: count }, (_, index) => ({ index, ...verdict })), factualIntegrity, scope: verdict, readability: Object.fromEntries(['clarity','order','economy','voice'].map(key => [key, { score: 2, evidence: 'Clear text.' }])) });
      }
      fs.writeFileSync(response, answer);
      console.log(JSON.stringify({ type: 'turn.completed', usage: { input_tokens: 10, output_tokens: 5 } }));
      record('finish');
    }, timeout);
  });
}
`,
  )
  await chmod(executable, 0o755)
  let environment = {
    CODEX_HOME: join(directory, '.codex'),
    HOME: directory,
    PATH: binaries,
  }
  onTestFinished(() => vi.unstubAllEnvs())
  for (let [name, value] of Object.entries(environment)) {
    vi.stubEnv(name, value)
  }
  let info = vi.spyOn(console, 'info').mockImplementation(() => {})
  let warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  onTestFinished(() => {
    info.mockRestore()
    warn.mockRestore()
  })
  let defaults = [
    '--case',
    '33,34',
    '--variant',
    'none',
    '--runs',
    '2',
    '--jobs',
    '2',
    '--model',
    'writer-model',
    '--output',
    output,
  ]
  function run(arguments_, options = {}) {
    return runEvaluations(arguments_, { root, ...options })
  }
  function launch(arguments_) {
    let child = spawn(process.execPath, [SCRIPT, ...arguments_], {
      env: { ...process.env, ...environment },
      stdio: ['ignore', 'pipe', 'pipe'],
      cwd: directory,
    })
    let stdout = ''
    let stderr = ''
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', chunk => {
      stdout += chunk
    })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', chunk => {
      stderr += chunk
    })
    reportOnFailure(arguments_, () => stderr)
    let done = new Promise((resolve, reject) => {
      child.once('error', reject)
      child.once('close', code => {
        resolve({ stdout, stderr, code })
      })
    })
    onTestFinished(async () => {
      if (child.exitCode === null && child.signalCode === null) {
        child.kill('SIGTERM')
        await done
      }
    })
    return { child, done }
  }
  return {
    async expectOffline(...created) {
      // Offline commands must not invoke Codex or create result artifacts.
      expect((await readdir(directory)).toSorted()).toStrictEqual(
        ['bin', ...created].toSorted(),
      )
    },
    result(caseId, variant, repeat) {
      return readJson(
        join(output, `case-${caseId}`, variant, `run-${repeat}`, 'result.json'),
      )
    },
    resume(arguments_ = [], options = {}) {
      return run(['--resume', output, ...arguments_], options)
    },
    start(arguments_ = [], options = {}) {
      return run([...defaults, ...arguments_], options)
    },
    startProcess(arguments_ = []) {
      return launch([...defaults, ...arguments_])
    },
    printed() {
      return info.mock.calls.map(call => call.join(' '))
    },
    async setMode(value) {
      await writeFile(modeFile, value)
    },
    plan() {
      return JSON.parse(info.mock.calls.at(-1)[0])
    },
    calls() {
      return readCalls(log)
    },
    directory,
    output,
    warn,
    log,
    run,
  }
}

async function projectRoot() {
  let root = await mkdtemp(join(tmpdir(), 'evaluation-project-'))
  onTestFinished(() => rm(root, { recursive: true, force: true }))
  let fixtures = join(root, 'test', 'fixtures')
  let input = join(fixtures, 'inputs', 'notes.md')
  let suite = join(fixtures, 'regression-tasks.json')
  await mkdir(dirname(input), { recursive: true })
  await cp(
    join(ROOT, 'skills', 'ghostwriter'),
    join(root, 'skills', 'ghostwriter'),
    { recursive: true },
  )
  await cp(join(ROOT, 'test', 'rubric.md'), join(root, 'test', 'rubric.md'))
  await writeFile(
    input,
    'Version 2.1 fixes upload retries. This is a really very important release.\n',
  )
  await saveJson(suite, {
    // cspell:disable-next-line
    evals: [
      {
        expectations: ['Keeps version 2.1.', 'Drops the filler sentence.'],
        prompt: 'Cut the filler from the release note in inputs/notes.md.',
        ...suiteField(
          'expected_output',
          'The note keeps the version and the fix.',
        ),
        files: ['inputs/notes.md'],
        name: 'edit-notes',
        id: 1,
      },
    ],
    ...suiteField('skill_name', 'ghostwriter'),
  })
  return { suite, input, root }
}

async function runOffline(arguments_) {
  let directory = await mkdtemp(join(tmpdir(), 'evaluation-cli-'))
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  let binaries = join(directory, 'bin')
  await mkdir(binaries)
  let executable = join(binaries, 'codex')
  let marker = join(directory, 'codex-was-invoked')
  await writeFile(
    executable,
    `#!${process.execPath}\nrequire('node:fs').writeFileSync(${JSON.stringify(marker)}, 'Unexpected invocation'); process.exit(97);\n`,
  )
  await chmod(executable, 0o755)
  let result = spawnSync(process.execPath, [SCRIPT, ...arguments_], {
    env: {
      ...process.env,
      CODEX_HOME: join(directory, '.codex'),
      HOME: directory,
      PATH: binaries,
    },
    encoding: 'utf8',
    timeout: 10000,
    cwd: directory,
  })
  reportOnFailure(arguments_, () => result.stderr)
  expect(result.error).toBeUndefined()
  // Offline commands must not invoke Codex or create result artifacts.
  await expect(readdir(directory)).resolves.toStrictEqual(['bin'])
  return result
}

async function baselineSnapshot(directory, description) {
  let baseline = join(directory, 'previous', 'ghostwriter')
  await cp(join(ROOT, 'skills', 'ghostwriter'), baseline, { recursive: true })
  let skill = join(baseline, 'SKILL.md')
  let content = await readFile(skill, 'utf8')
  await writeFile(
    skill,
    content.replace('Writes and edits technical text', description),
  )
  return baseline
}

async function waitForCalls(filename, attempts = 100) {
  let calls = await readCalls(filename)
  if (calls.filter(call => call.event === 'start').length >= 2) {
    return calls
  }
  if (attempts <= 1) {
    throw new Error('Fake model calls did not start.')
  }
  await new Promise(resolve => {
    setTimeout(resolve, 50)
  })
  return await waitForCalls(filename, attempts - 1)
}

async function readCalls(filename) {
  try {
    return (await readFile(filename, 'utf8'))
      .trim()
      .split('\n')
      .filter(Boolean)
      .map(line => JSON.parse(line))
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

function countActiveCalls(calls) {
  let active = 0
  let maximum = 0
  for (let call of calls) {
    active += call.event === 'start' ? 1 : -1
    maximum = Math.max(maximum, active)
  }
  return { maximum, active }
}

function reportOnFailure(arguments_, readStderr) {
  onTestFailed(() => {
    console.error(
      `run-evaluations ${arguments_.join(' ')}\nstderr:\n${readStderr()}`,
    )
  })
}

function startedSince(calls, before) {
  return calls.slice(before.length).filter(call => call.event === 'start')
}

async function saveJson(filename, data) {
  await writeFile(filename, `${JSON.stringify(data, null, 2)}\n`)
}

async function updateJson(filename, update) {
  await saveJson(filename, update(await readJson(filename)))
}

async function readJson(filename) {
  return JSON.parse(await readFile(filename, 'utf8'))
}

// Suite files use snake_case keys.
function suiteField(name, value) {
  return { [name]: value }
}

describe('run-evaluations', () => {
  it('cli help and listing work offline without generating artifacts', async () => {
    let help = await runOffline(['--help'])
    expect(help.status).toBe(0)
    expect(help.stdout).toMatch(/--dry-run/u)
    let listing = await runOffline(['--list'])
    expect(listing.status).toBe(0)
    expect(listing.stdout).toMatch(/^1\s+edit-readme/mu)
    expect(listing.stdout).toMatch(/^33\s+/mu)
  })

  it('the cli prints an error and exits with 1 before probing Codex', async () => {
    let result = await runOffline(['--model', 'test-model'])
    expect(result.status).toBe(1)
    expect(result.stderr).toBe(
      'Select --case or --all before making model calls\n',
    )
  })

  it.each([
    { name: 'no arguments', arguments_: [] },
    { arguments_: ['--help'], name: '--help' },
  ])('prints help for $name without model calls', async ({ arguments_ }) => {
    let runtime = await fakeRuntime('offline')
    await expect(runtime.run(arguments_)).resolves.toBe(0)
    expect(runtime.printed()).toHaveLength(1)
    expect(runtime.printed()[0]).toContain('--dry-run')
    expect(runtime.printed()[0]).toContain('pnpm eval --resume')
    await runtime.expectOffline()
  })

  it('lists the cases of the chosen suite and split', async () => {
    let runtime = await fakeRuntime('offline')
    let triggers = await readJson(join(ROOT, 'test/fixtures/triggers.json'))
    let query = triggers.queries.find(item => item.id === 11)
    await expect(runtime.run(['--list'])).resolves.toBe(0)
    let development = runtime.printed()
    expect(development[0]).toBe('1\tedit-readme')
    expect(development).toContain('33\treadme-for-office-staff')
    expect(development).not.toContain('37\tkeep-clear-personal-release-note')
    await expect(
      runtime.run(['--list', '--split', 'holdout', '--case', '37,38']),
    ).resolves.toBe(0)
    await expect(
      runtime.run(['--list', '--suite', 'triggers', '--case', '11']),
    ).resolves.toBe(0)
    expect(runtime.printed().slice(development.length)).toStrictEqual([
      '37\tkeep-clear-personal-release-note',
      '38\tpoint-edit-ui-label-not-log',
      `11\t${query.prompt}`,
    ])
    await runtime.expectOffline()
  })

  it('a graded dry run counts both model calls and honors variants and repeats', async () => {
    let runtime = await fakeRuntime('offline')
    await expect(
      runtime.run([
        '--dry-run',
        '--case',
        '33',
        '--variant',
        'current',
        '--grade',
        '--runs',
        '2',
        '--output',
        runtime.output,
      ]),
    ).resolves.toBe(0)
    let plan = runtime.plan()
    expect(plan.cases).toStrictEqual(['readme-for-office-staff'])
    expect(plan.variants).toStrictEqual(['current'])
    expect(plan.runs).toBe(2)
    expect(plan.modelCalls).toBe(4)
    expect(plan.plannedModelCalls).toStrictEqual({
      grader: 2,
      writer: 2,
      total: 4,
    })
    expect(plan.planned).toStrictEqual({
      current: { expectations: 14, runs: 2 },
    })
    expect(plan.grader).toStrictEqual({ effort: 'medium', model: null })
    expect(plan.writer).toStrictEqual({ effort: 'medium', model: null })
    expect(plan.sameModel).toBeNull()
    expect('trials' in plan).toBe(false)
    await runtime.expectOffline()
  })

  it('trigger dry runs omit the no-skill variant', async () => {
    let runtime = await fakeRuntime('offline')
    await expect(
      runtime.run([
        '--dry-run',
        '--suite',
        'triggers',
        '--case',
        '1',
        '--runs',
        '2',
      ]),
    ).resolves.toBe(0)
    let plan = runtime.plan()
    expect(plan.variants).toStrictEqual(['current'])
    expect(plan.modelCalls).toBe(2)
    expect(plan.cases).toStrictEqual([1])
    expect(plan.grader).toBeNull()
    expect(plan.planned).toStrictEqual({
      current: { expectations: 0, runs: 2 },
    })
    await runtime.expectOffline()
  })

  it.each([
    { variants: ['current', 'none'], arguments_: [] },
    {
      arguments_: ['--baseline', '/unused/snapshot'],
      variants: ['current', 'none', 'previous'],
    },
    {
      arguments_: ['--suite', 'triggers', '--baseline', '/unused/snapshot'],
      variants: ['current', 'previous'],
    },
    {
      arguments_: ['--variant', 'current,previous', '--baseline', '/unused'],
      variants: ['current', 'previous'],
    },
  ])(
    'a dry run with $arguments_ plans the $variants variants',
    async ({ arguments_, variants }) => {
      let runtime = await fakeRuntime('offline')
      await expect(
        runtime.run(['--dry-run', '--case', '1', ...arguments_]),
      ).resolves.toBe(0)
      expect(runtime.plan().variants).toStrictEqual(variants)
      await runtime.expectOffline()
    },
  )

  it('live runs require explicit case selection before probing Codex', async () => {
    let runtime = await fakeRuntime('offline')
    await expect(runtime.run(['--model', 'test-model'])).rejects.toThrow(
      'Select --case or --all before making model calls',
    )
    await runtime.expectOffline()
  })

  it('rejects unknown cases and missing models without invoking Codex', async () => {
    let runtime = await fakeRuntime('offline')
    await expect(
      runtime.run(['--dry-run', '--case', 'missing-case']),
    ).rejects.toThrow('Unknown case in dev: missing-case')
    await expect(runtime.run(['--case', '33'])).rejects.toThrow(
      'Choose an explicit --model for a repeatable run',
    )
    await expect(runtime.run(['--case', '33', '--model', ' '])).rejects.toThrow(
      'Choose an explicit --model for a repeatable run',
    )
    await runtime.expectOffline()
  })

  it('requires an explicit live grader and accepts deliberate same-model grading', async () => {
    let runtime = await fakeRuntime('offline')
    await expect(
      runtime.run(['--case', '33', '--model', 'writer-model', '--grade']),
    ).rejects.toThrow('Choose an explicit --grader-model with --grade')
    await expect(
      runtime.run([
        '--case',
        '33',
        '--model',
        'writer-model',
        '--grade',
        '--grader-model',
        ' ',
      ]),
    ).rejects.toThrow('Choose an explicit --grader-model with --grade')
    await expect(
      runtime.run([
        '--dry-run',
        '--case',
        '33',
        '--model',
        'same-model',
        '--grade',
        '--grader-model',
        'same-model',
        '--grader-effort',
        'high',
        '--jobs',
        '2',
      ]),
    ).resolves.toBe(0)
    let plan = runtime.plan()
    expect(plan.sameModel).toBe(true)
    expect(plan.grader).toStrictEqual({ model: 'same-model', effort: 'high' })
    expect(plan.jobs).toBe(2)
    await runtime.expectOffline()
  })

  it.each([
    {
      message: '--jobs must be a positive integer',
      arguments_: ['--jobs', '0'],
    },
    {
      message: '--jobs must be a positive integer',
      arguments_: ['--jobs', '1.5'],
    },
    {
      message: '--jobs must be a positive integer',
      arguments_: ['--jobs', 'text'],
    },
    { message: '--retries must be 0–10', arguments_: ['--retries', '1.5'] },
    { message: '--retries must be 0–10', arguments_: ['--retries', '11'] },
    { arguments_: ['--suite', 'unit'], message: 'Invalid --suite' },
    { arguments_: ['--split', 'test'], message: 'Invalid --split' },
    { arguments_: ['--effort', 'extreme'], message: 'Invalid --effort' },
    {
      arguments_: ['--grader-effort', 'none'],
      message: 'Invalid --grader-effort',
    },
    { message: '--runs must be 1–100', arguments_: ['--runs', '0'] },
    { message: '--runs must be 1–100', arguments_: ['--runs', '101'] },
    {
      message: '--timeout must be a positive number of seconds',
      arguments_: ['--timeout', '0.5'],
    },
    {
      message: '--timeout must be a positive number of seconds',
      arguments_: ['--timeout', 'soon'],
    },
    { message: 'Choose --case or --all, not both', arguments_: ['--all'] },
    {
      message:
        '--variant needs unique current,none,previous values, or all alone',
      arguments_: ['--variant', 'current,current'],
    },
    {
      message:
        '--variant needs unique current,none,previous values, or all alone',
      arguments_: ['--variant', 'all,current'],
    },
    {
      message:
        '--variant needs unique current,none,previous values, or all alone',
      arguments_: ['--variant', 'latest'],
    },
    {
      message:
        'Trigger runs use observed reads, not grading or a no-skill variant',
      arguments_: ['--suite', 'triggers', '--variant', 'current,none'],
    },
    {
      message:
        'Trigger runs use observed reads, not grading or a no-skill variant',
      arguments_: ['--suite', 'triggers', '--grade'],
    },
    {
      message: '--variant previous needs --baseline',
      arguments_: ['--variant', 'previous'],
    },
    {
      arguments_: ['--grader-model', 'grader-model'],
      message: '--grader-model requires --grade',
    },
    {
      message: 'Unknown case in holdout: 1',
      arguments_: ['--split', 'holdout'],
    },
  ])(
    'rejects $arguments_ without model calls',
    async ({ arguments_, message }) => {
      let runtime = await fakeRuntime('offline')
      await expect(
        runtime.run(['--dry-run', '--case', '1', ...arguments_]),
      ).rejects.toThrow(message)
      await runtime.expectOffline()
    },
  )

  it.each([
    { arguments_: ['--model', 'other-model'], option: 'model' },
    { arguments_: ['--grade'], option: 'grade' },
    { arguments_: ['--runs', '3'], option: 'runs' },
  ])(
    'resume refuses --$option because it reuses the saved settings',
    async ({ arguments_, option }) => {
      let runtime = await fakeRuntime('offline')
      await expect(runtime.resume(arguments_)).rejects.toThrow(
        `--resume reuses the saved settings; --${option} cannot change them`,
      )
      await runtime.expectOffline()
    },
  )

  it('resume of a missing results directory fails with the filesystem error', async () => {
    let runtime = await fakeRuntime('offline')
    await expect(runtime.resume(['--dry-run'])).rejects.toMatchObject({
      code: 'ENOENT',
    })
    await runtime.expectOffline()
  })

  it.each([
    { name: 'an empty manifest', manifest: {} },
    {
      manifest: {
        writer: { model: 'writer-model', effort: 'medium' },
        variants: ['none'],
        suiteSha256: 'abc',
        timeoutMs: 180000,
        snapshots: {},
        runs: 1,
      },
      name: 'a manifest without grader settings',
    },
  ])('resume refuses $name that predates --resume', async ({ manifest }) => {
    let runtime = await fakeRuntime('offline')
    await mkdir(runtime.output)
    await saveJson(join(runtime.output, 'manifest.json'), manifest)
    await expect(runtime.resume()).rejects.toThrow(
      `Cannot resume ${await realpath(runtime.output)}: its manifest predates --resume`,
    )
    await runtime.expectOffline('results')
  })

  it(
    'parallel CLI trials bound model calls, use a separate grader, and save consistent artifacts',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      let hostSkill = join(runtime.directory, '.agents', 'skills', 'other')
      await mkdir(hostSkill, { recursive: true })
      await writeFile(join(hostSkill, 'SKILL.md'), '# Other\n')
      await expect(
        runtime.start([
          '--grade',
          '--grader-model',
          'grader-model',
          '--effort',
          'low',
          '--grader-effort',
          'high',
        ]),
      ).resolves.toBe(0)
      let calls = await runtime.calls()
      let { maximum, active } = countActiveCalls(calls)
      expect(maximum).toBe(2)
      expect(active).toBe(0)
      let starts = calls.filter(call => call.event === 'start')
      expect(starts).toHaveLength(8)
      let workspaces = new Set(starts.map(call => call.cwd))
      expect(workspaces.size).toBe(8)
      let writers = starts.filter(call => call.phase === 'writer')
      for (let writer of writers) {
        expect(writer.model).toBe('writer-model')
        expect(writer.effort).toBe('model_reasoning_effort="low"')
      }
      let graders = starts.filter(call => call.phase === 'grader')
      for (let grader of graders) {
        expect(grader.model).toBe('grader-model')
        expect(grader.effort).toBe('model_reasoning_effort="high"')
      }
      await Promise.all(
        starts.map(call =>
          expect(stat(call.cwd)).rejects.toMatchObject({ code: 'ENOENT' }),
        ),
      )
      let hostSkillPath = join(await realpath(hostSkill), 'SKILL.md')
      for (let call of starts) {
        expect(call.disabled).toContain(JSON.stringify(hostSkillPath))
      }
      let output = await realpath(runtime.output)
      expect(runtime.printed()).toContain(
        `Planning 8 model calls with 2 jobs. Results: ${output}`,
      )
      expect(runtime.printed()).toContain(
        '33 | none | 1 | completed | grade: true',
      )
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.execution.planned).toBe(4)
      expect(summary.execution.finished).toBe(4)
      expect(summary.execution.skipped).toBe(0)
      expect(summary.variants.none.total).toBe(4)
      let manifest = await readJson(join(runtime.output, 'manifest.json'))
      expect(manifest.jobs).toBe(2)
      expect(manifest.grader.model).toBe('grader-model')
      expect(manifest.sameModel).toBe(false)
      expect(manifest.triggerMethod).toBeNull()
      expect(manifest.disabledSkillPaths).toContain(hostSkillPath)
      let records = await Promise.all(
        manifest.trials.map(trial =>
          runtime.result(trial.caseId, trial.variant, trial.repeat),
        ),
      )
      expect(records).toHaveLength(4)
      for (let record of records) {
        expect(record.expectationCount).toBeGreaterThan(0)
        expect(record.grade.pass).toBe(true)
        expect(record.gradingRun.status).toBe('completed')
      }
      await expect(
        readJson(
          join(
            runtime.output,
            'case-33',
            'none',
            'run-1',
            'grading',
            'grade.json',
          ),
        ),
      ).resolves.toStrictEqual(records[0].grade)
      await expect(runtime.start()).rejects.toMatchObject({ code: 'EEXIST' })
      await expect(runtime.calls()).resolves.toHaveLength(calls.length)
      await expect(
        readJson(join(runtime.output, 'summary.json')),
      ).resolves.toStrictEqual(summary)
    },
  )

  it(
    'fatal infrastructure failure aborts in-flight trials and lists queued trials as skipped',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('failure')
      await expect(runtime.start(['--retries', '0'])).resolves.toBe(1)
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.execution.started).toBe(2)
      expect(summary.execution.finished).toBe(2)
      expect(summary.execution.skipped).toBe(2)
      expect(summary.variants.none.total).toBe(2)
      expect(summary.variants.none.selected).toBe(4)
      let skipped = await readJson(join(runtime.output, 'skipped.json'))
      expect(skipped).toHaveLength(2)
      let first = await runtime.result(33, 'none', 1)
      let second = await runtime.result(33, 'none', 2)
      expect(first.status).toBe('failed')
      expect(second.status).toBe('aborted')
      expect(first.expectationCount).toBeGreaterThan(0)
      expect(second.expectationCount).toBeGreaterThan(0)
      expect(summary.execution.stopReason).toBe(first.error)
      expect(skipped.map(trial => trial.reason)).toStrictEqual([
        first.error,
        first.error,
      ])
      expect(runtime.printed()).toContain(
        `33 | none | 1 | failed | ${first.error}`,
      )
    },
  )

  it(
    'resume runs the trials an interrupted run skipped and sets aside the rest',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('failure')
      await expect(runtime.start(['--retries', '0'])).resolves.toBe(1)
      let callsBefore = await runtime.calls()
      await runtime.setMode('success')
      await expect(runtime.resume(['--dry-run'])).resolves.toBe(0)
      expect(runtime.plan()).toMatchObject({ remaining: 4, reused: 0 })
      await expect(runtime.resume()).resolves.toBe(0)
      expect(startedSince(await runtime.calls(), callsBefore)).toHaveLength(4)
      let records = await Promise.all([
        runtime.result(33, 'none', 1),
        runtime.result(33, 'none', 2),
        runtime.result(34, 'none', 1),
        runtime.result(34, 'none', 2),
      ])
      expect(records.map(record => record.status)).toStrictEqual([
        'completed',
        'completed',
        'completed',
        'completed',
      ])
      expect(
        records.map(record =>
          record.failedAttempts.map(attempt => [attempt.phase, attempt.status]),
        ),
      ).toStrictEqual([[['trial', 'failed']], [['trial', 'aborted']], [], []])
      let skipped = await readJson(join(runtime.output, 'skipped.json'))
      expect(skipped).toStrictEqual([])
    },
  )

  it(
    'repeated failures of a trial are set aside under increasing attempt numbers',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('fail-last')
      await expect(runtime.start(['--jobs', '1'])).resolves.toBe(1)
      let failed = await runtime.result(34, 'none', 2)
      expect(failed.status).toBe('failed')
      expect(
        failed.failedAttempts.map(attempt => attempt.artifacts),
      ).toStrictEqual([join('case-34', 'none', 'run-2.failed-1')])
      await mkdir(join(runtime.output, 'case-34', 'none', 'run-2.failed-notes'))
      await runtime.setMode('success')
      await expect(runtime.resume()).resolves.toBe(0)
      let record = await runtime.result(34, 'none', 2)
      expect(record.status).toBe('completed')
      expect(
        record.failedAttempts.map(attempt => [
          attempt.phase,
          attempt.status,
          attempt.artifacts,
        ]),
      ).toStrictEqual([
        ['writer', 'failed', join('case-34', 'none', 'run-2.failed-1')],
        ['trial', 'failed', join('case-34', 'none', 'run-2.failed-2')],
      ])
      await expect(
        readJson(
          join(
            runtime.output,
            'case-34',
            'none',
            'run-2.failed-2',
            'result.json',
          ),
        ),
      ).resolves.toStrictEqual(failed)
    },
  )

  it(
    'an input file that disappears during a run fails the next trial',
    LIVE,
    async () => {
      let project = await projectRoot()
      let runtime = await fakeRuntime('delete-input', {
        input: project.input,
        root: project.root,
      })
      await expect(
        runtime.run([
          '--case',
          'edit-notes',
          '--variant',
          'none',
          '--runs',
          '2',
          '--model',
          'writer-model',
          '--output',
          runtime.output,
        ]),
      ).resolves.toBe(1)
      await expect(runtime.result(1, 'none', 1)).resolves.toMatchObject({
        status: 'completed',
      })
      let failed = await runtime.result(1, 'none', 2)
      expect(failed.status).toBe('failed')
      expect(failed.error).toMatch(/^ENOENT: .*notes\.md/u)
      let starts = (await runtime.calls()).filter(
        call => call.event === 'start',
      )
      expect(starts.map(call => basename(call.trial))).toStrictEqual(['run-1'])
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.execution.stopReason).toBe(failed.error)
    },
  )

  it(
    'sigint saves every started trial and cleans scratch workspaces',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('hang')
      let execution = runtime.startProcess()
      let calls = await waitForCalls(runtime.log)
      execution.child.kill('SIGINT')
      let completed = await execution.done
      expect(completed.code).toBe(1)
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.execution.started).toBe(summary.execution.finished)
      expect(summary.execution.skipped).toBe(2)
      await Promise.all(
        calls
          .filter(call => call.event === 'start')
          .map(call =>
            expect(stat(call.cwd)).rejects.toMatchObject({ code: 'ENOENT' }),
          ),
      )
      let records = await Promise.all(
        [1, 2].map(repeat => runtime.result(33, 'none', repeat)),
      )
      for (let record of records) {
        expect(record.status).toBe('aborted')
      }
    },
  )

  it(
    'a failed writer call and an invalid grade are retried once with their artifacts kept',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('flaky')
      await expect(
        runtime.start(['--grade', '--grader-model', 'grader']),
      ).resolves.toBe(0)
      let writer = await runtime.result(33, 'none', 1)
      expect(writer.grade.pass).toBe(true)
      expect(
        writer.failedAttempts.map(attempt => [
          attempt.phase,
          attempt.artifacts,
        ]),
      ).toStrictEqual([['writer', join('case-33', 'none', 'run-1.failed-1')]])
      await stat(
        join(
          runtime.output,
          'case-33',
          'none',
          'run-1.failed-1',
          'trace.jsonl',
        ),
      )
      let grader = await runtime.result(34, 'none', 1)
      expect(grader.grade.pass).toBe(true)
      expect(grader.failedAttempts).toHaveLength(1)
      expect(grader.failedAttempts[0].phase).toBe('grader')
      expect(grader.failedAttempts[0].error).toMatch(/JSON/u)
      await stat(
        join(
          runtime.output,
          'case-34',
          'none',
          'run-1',
          'grading.failed-1',
          'response.md',
        ),
      )
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.variants.none.failedAttempts).toBe(2)
      expect(summary.variants.none.passed).toBe(4)
      let calls = await runtime.calls()
      expect(calls.filter(call => call.event === 'start')).toHaveLength(10)
    },
  )

  it(
    'a failing grade exits with 1 after every trial completes',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('reject')
      await expect(
        runtime.start(['--runs', '1', '--grade', '--grader-model', 'grader']),
      ).resolves.toBe(1)
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.execution).toMatchObject({
        stopReason: null,
        finished: 2,
        skipped: 0,
      })
      expect(summary.variants.none).toMatchObject({
        qualityFailed: 2,
        completed: 2,
        passed: 0,
        failed: 2,
      })
      let record = await runtime.result(33, 'none', 1)
      expect(record.status).toBe('completed')
      expect(record.grade.pass).toBe(false)
      expect(record.grade.factualIntegrity).toStrictEqual({
        evidence: 'The import time changed.',
        pass: false,
      })
      expect(runtime.printed()).toContain(
        '33 | none | 1 | completed | grade: false',
      )
    },
  )

  it(
    'trigger runs score observed skill reads against the expected activation',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('triggers')
      await expect(
        runtime.run([
          '--suite',
          'triggers',
          '--case',
          '1,2,11,12',
          '--model',
          'writer-model',
          '--jobs',
          '4',
          '--output',
          runtime.output,
        ]),
      ).resolves.toBe(1)
      let triggers = await Promise.all(
        [1, 2, 11, 12].map(async id => {
          let record = await runtime.result(id, 'current', 1)
          return [id, record.trigger]
        }),
      )
      let read = 'cat skill/ghostwriter/SKILL.md'
      expect(Object.fromEntries(triggers)).toStrictEqual({
        2: {
          evidence:
            'Unknown read method; inspect the trace before scoring activation: python3 read.py skill/ghostwriter/SKILL.md',
          expected: true,
          observed: null,
          pass: null,
        },
        11: {
          evidence:
            'No supported successful read showed the skill name and first heading.',
          expected: false,
          observed: false,
          pass: true,
        },
        12: { expected: false, evidence: read, observed: true, pass: false },
        1: { evidence: read, expected: true, observed: true, pass: true },
      })
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.execution.stopReason).toBeNull()
      expect(Object.keys(summary.variants)).toStrictEqual(['current'])
      let manifest = await readJson(join(runtime.output, 'manifest.json'))
      expect(manifest.triggerMethod).toBe(
        'controlled-catalog-observed-command-output',
      )
      expect(manifest.grader).toBeNull()
      await expect(
        readFile(
          join(runtime.output, 'case-1', 'current', 'run-1', 'prompt.txt'),
          'utf8',
        ),
      ).resolves.toContain('Decide whether this skill applies.')
      expect(runtime.printed()).toStrictEqual(
        expect.arrayContaining([
          '1 | current | 1 | completed | trigger: true',
          '2 | current | 1 | completed | trigger: null',
          '12 | current | 1 | completed | trigger: false',
        ]),
      )
    },
  )

  it(
    'trigger runs whose observed reads all match exit with 0',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('triggers')
      await expect(
        runtime.run([
          '--suite',
          'triggers',
          '--case',
          '1,11',
          '--model',
          'writer-model',
          '--jobs',
          '2',
          '--output',
          runtime.output,
        ]),
      ).resolves.toBe(0)
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.variants.current).toMatchObject({ passed: 2, graded: 2 })
    },
  )

  it(
    'an outdated Codex CLI stops new and resumed runs before any model call',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('outdated')
      await expect(runtime.start()).rejects.toThrow(OUTDATED)
      await expect(stat(runtime.output)).rejects.toMatchObject({
        code: 'ENOENT',
      })
      await runtime.setMode('success')
      await expect(runtime.start(['--runs', '1'])).resolves.toBe(0)
      let calls = await runtime.calls()
      await runtime.setMode('outdated')
      await expect(runtime.resume()).rejects.toThrow(OUTDATED)
      let manifest = await readJson(join(runtime.output, 'manifest.json'))
      expect(manifest.resumes).toBeUndefined()
      await expect(runtime.calls()).resolves.toHaveLength(calls.length)
    },
  )

  it(
    'a baseline snapshot is copied into the results and given to its writer',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      let baseline = await baselineSnapshot(
        runtime.directory,
        'Edits technical text (previous release)',
      )
      await expect(
        runtime.start([
          '--case',
          '33',
          '--runs',
          '1',
          '--jobs',
          '3',
          '--variant',
          'all',
          '--baseline',
          baseline,
        ]),
      ).resolves.toBe(0)
      let manifest = await readJson(join(runtime.output, 'manifest.json'))
      expect(manifest.variants).toStrictEqual(['current', 'none', 'previous'])
      expect(manifest.snapshots.previous.metadata.description).toMatch(
        /^Edits technical text \(previous release\)/u,
      )
      expect(manifest.snapshots.previous.metadata.firstHeading).toBe(
        '# Ghostwriter',
      )
      await expect(
        readFile(
          join(
            runtime.output,
            'snapshots',
            'previous',
            'ghostwriter',
            'SKILL.md',
          ),
          'utf8',
        ),
      ).resolves.toBe(await readFile(join(baseline, 'SKILL.md'), 'utf8'))
      let starts = (await runtime.calls()).filter(
        call => call.event === 'start',
      )
      let skills = Object.fromEntries(
        starts.map(call => [basename(dirname(call.trial)), call.skill]),
      )
      expect(skills.none).toBeNull()
      expect(skills.current).toContain('Writes and edits technical text')
      expect(skills.previous).toContain('(previous release)')
      await expect(
        readFile(
          join(runtime.output, 'case-33', 'previous', 'run-1', 'prompt.txt'),
          'utf8',
        ),
      ).resolves.toContain(
        'Read and use the skill at skill/ghostwriter/SKILL.md',
      )
    },
  )

  it(
    'a symlinked baseline is refused before any results are written',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      let release = await baselineSnapshot(runtime.directory, 'Edits text')
      let baseline = join(runtime.directory, 'linked')
      await symlink(release, baseline)
      await expect(
        runtime.start(['--variant', 'previous', '--baseline', baseline]),
      ).rejects.toThrow(
        `Skill snapshot root must not be a symlink: ${baseline}`,
      )
      await expect(stat(runtime.output)).rejects.toMatchObject({
        code: 'ENOENT',
      })
      await expect(runtime.calls()).resolves.toStrictEqual([])
    },
  )

  it(
    'results inside the baseline snapshot are refused before they are written',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      let baseline = await baselineSnapshot(runtime.directory, 'Edits text')
      let output = join(baseline, 'results')
      await expect(
        runtime.start([
          '--variant',
          'previous',
          '--baseline',
          baseline,
          '--output',
          output,
        ]),
      ).rejects.toThrow('Results must be outside the source skill directory')
      await expect(stat(output)).rejects.toMatchObject({ code: 'ENOENT' })
    },
  )

  it.each([
    {
      message: 'Snapshot lacks frontmatter: {path}',
      skill: '# Ghostwriter\n',
      name: 'no frontmatter',
    },
    {
      skill: '---\nname: [ghostwriter\n---\n# Ghostwriter\n',
      message: 'Invalid snapshot frontmatter: {path}',
      name: 'invalid frontmatter',
    },
    {
      skill: '---\nname: ghostwriter\n---\n# Ghostwriter\n',
      message: 'Snapshot needs name and description',
      name: 'no description',
    },
    {
      skill:
        '---\nname: ghostwriter\ndescription: Edits text.\n---\n## Rules\n',
      message: 'Snapshot needs a top-level heading for observed-read checks',
      name: 'no top-level heading',
    },
  ])(
    'a baseline with $name is refused before any model call',
    LIVE,
    async ({ message, skill }) => {
      let runtime = await fakeRuntime()
      let baseline = join(runtime.directory, 'previous')
      await mkdir(baseline)
      await writeFile(join(baseline, 'SKILL.md'), skill)
      await expect(
        runtime.start(['--variant', 'previous', '--baseline', baseline]),
      ).rejects.toThrow(message.replace('{path}', await realpath(baseline)))
      await expect(runtime.calls()).resolves.toStrictEqual([])
    },
  )

  it(
    'an output path below a regular file fails with the filesystem error',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      let file = join(runtime.directory, 'notes.txt')
      await writeFile(file, '')
      await expect(
        runtime.start(['--output', join(file, 'results')]),
      ).rejects.toMatchObject({ code: 'ENOTDIR' })
      await expect(runtime.calls()).resolves.toStrictEqual([])
    },
  )

  it(
    'input files reach the writer and the grader, and results default to .eval-results',
    LIVE,
    async () => {
      let project = await projectRoot()
      let runtime = await fakeRuntime('success', { root: project.root })
      let note = await readFile(project.input, 'utf8')
      await expect(
        runtime.run([
          '--case',
          'edit-notes',
          '--variant',
          'none',
          '--model',
          'writer-model',
          '--grade',
          '--grader-model',
          'grader-model',
        ]),
      ).resolves.toBe(0)
      let results = join(await realpath(project.root), '.eval-results')
      let [name] = await readdir(results)
      expect(name).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.\d{3}Z$/u)
      let output = join(results, name)
      expect(runtime.printed()).toContain(
        `Planning 2 model calls with 1 jobs. Results: ${output}`,
      )
      let starts = (await runtime.calls()).filter(
        call => call.event === 'start',
      )
      expect(starts.map(call => [call.phase, call.input])).toStrictEqual([
        ['writer', note],
        ['grader', note],
      ])
      await expect(
        readFile(join(output, 'case-1', 'none', 'run-1', 'prompt.txt'), 'utf8'),
      ).resolves.toContain('Input files:\ninputs/notes.md')
      let record = await readJson(
        join(output, 'case-1', 'none', 'run-1', 'result.json'),
      )
      expect(record.status).toBe('completed')
      expect(record.grade.pass).toBe(true)
      // cspell:disable-next-line
      let cases = (await readJson(project.suite)).evals
      await expect(readJson(join(output, 'cases.json'))).resolves.toStrictEqual(
        cases,
      )
    },
  )

  it(
    'a grading failure before the grader starts is graded again on resume',
    LIVE,
    async () => {
      let project = await projectRoot()
      let runtime = await fakeRuntime('delete-input', {
        input: project.input,
        root: project.root,
      })
      let note = await readFile(project.input, 'utf8')
      await expect(
        runtime.run([
          '--case',
          'edit-notes',
          '--variant',
          'none',
          '--model',
          'writer-model',
          '--grade',
          '--grader-model',
          'grader-model',
          '--output',
          runtime.output,
        ]),
      ).resolves.toBe(1)
      let failed = await runtime.result(1, 'none', 1)
      expect(failed.status).toBe('grading_failed')
      expect(failed.writerStatus).toBe('completed')
      expect(failed.error).toMatch(/^ENOENT: /u)
      expect('gradingRun' in failed).toBe(false)
      let run = join(runtime.output, 'case-1', 'none', 'run-1')
      await expect(stat(join(run, 'grading'))).rejects.toMatchObject({
        code: 'ENOENT',
      })
      let callsBefore = await runtime.calls()
      await writeFile(project.input, note)
      await runtime.setMode('success')
      await expect(runtime.resume()).resolves.toBe(0)
      let started = startedSince(await runtime.calls(), callsBefore)
      expect(started.map(call => [call.phase, call.input])).toStrictEqual([
        ['grader', note],
      ])
      let record = await runtime.result(1, 'none', 1)
      expect(record.status).toBe('completed')
      expect(record.grade.pass).toBe(true)
      expect(record.failedAttempts).toStrictEqual([
        {
          error: failed.error,
          status: 'failed',
          phase: 'grader',
          artifacts: null,
        },
      ])
    },
  )

  it(
    'resume refuses a suite that changed after the run started',
    LIVE,
    async () => {
      let project = await projectRoot()
      let runtime = await fakeRuntime('success', { root: project.root })
      await expect(
        runtime.run([
          '--case',
          'edit-notes',
          '--variant',
          'none',
          '--model',
          'writer-model',
          '--output',
          runtime.output,
        ]),
      ).resolves.toBe(0)
      await updateJson(project.suite, suite => ({
        ...suite,
        // cspell:disable-next-line
        evals: suite.evals.map(item => ({
          ...item,
          expectations: [...item.expectations, 'Names the upload fix.'],
        })),
      }))
      let calls = await runtime.calls()
      await expect(runtime.resume()).rejects.toThrow(
        'The suite changed after this run started; start a new run instead',
      )
      await expect(runtime.calls()).resolves.toHaveLength(calls.length)
    },
  )

  it(
    'resume reruns only unfinished trials and keeps the failed attempt',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('fail-last')
      await expect(
        runtime.start(['--jobs', '1', '--retries', '0']),
      ).resolves.toBe(1)
      let callsBefore = await runtime.calls()
      await expect(runtime.resume(['--dry-run'])).resolves.toBe(0)
      let plan = runtime.plan()
      expect(plan.reused).toBe(3)
      expect(plan.remaining).toBe(1)
      expect(plan.plannedModelCalls.total).toBe(1)
      expect(plan.outputDirectory).toBe(await realpath(runtime.output))
      await expect(
        stat(join(runtime.output, 'case-34', 'none', 'run-2.failed-1')),
      ).rejects.toMatchObject({ code: 'ENOENT' })
      await expect(runtime.calls()).resolves.toHaveLength(callsBefore.length)
      await runtime.setMode('success')
      await expect(runtime.resume(['--jobs', '2'])).resolves.toBe(0)
      let started = startedSince(await runtime.calls(), callsBefore)
      expect(started).toHaveLength(1)
      expect(started[0].trial.endsWith(join('case-34', 'none', 'run-2'))).toBe(
        true,
      )
      let previous = await readJson(
        join(
          runtime.output,
          'case-34',
          'none',
          'run-2.failed-1',
          'result.json',
        ),
      )
      expect(previous.status).toBe('failed')
      let record = await runtime.result(34, 'none', 2)
      expect(record.status).toBe('completed')
      expect(record.failedAttempts[0].phase).toBe('trial')
      expect(record.failedAttempts[0].status).toBe('failed')
      expect(record.failedAttempts[0].error).toBe(previous.error)
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.execution.reused).toBe(3)
      expect(summary.variants.none.completed).toBe(4)
      let manifest = await readJson(join(runtime.output, 'manifest.json'))
      expect(manifest.resumes).toHaveLength(1)
      expect(manifest.writer.model).toBe('writer-model')
      expect(runtime.printed()).toContain(
        `Planning 1 model calls with 2 jobs. Results: ${await realpath(runtime.output)}`,
      )
    },
  )

  it('resume reruns a trial whose result was never saved', LIVE, async () => {
    let runtime = await fakeRuntime()
    await expect(runtime.start(['--case', '33', '--runs', '1'])).resolves.toBe(
      0,
    )
    await rm(join(runtime.output, 'case-33', 'none', 'run-1', 'result.json'))
    await expect(runtime.resume(['--dry-run'])).resolves.toBe(0)
    expect(runtime.plan()).toMatchObject({ remaining: 1, reused: 0 })
    await expect(runtime.resume()).resolves.toBe(0)
    let record = await runtime.result(33, 'none', 1)
    expect(record.status).toBe('completed')
    expect(record.failedAttempts).toStrictEqual([
      {
        artifacts: join('case-33', 'none', 'run-1.failed-1'),
        status: 'incomplete',
        phase: 'trial',
        error: null,
      },
    ])
    await expect(
      readFile(
        join(
          runtime.output,
          'case-33',
          'none',
          'run-1.failed-1',
          'response.md',
        ),
        'utf8',
      ),
    ).resolves.toBe('Writer response.')
  })

  it(
    'resume grades a saved writer response without calling the writer again',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('fail-last-grader')
      await expect(
        runtime.start([
          '--grade',
          '--grader-model',
          'grader-model',
          '--jobs',
          '1',
          '--retries',
          '0',
        ]),
      ).resolves.toBe(1)
      let run = join(runtime.output, 'case-34', 'none', 'run-2')
      expect((await readJson(join(run, 'result.json'))).status).toBe(
        'grading_failed',
      )
      let response = await readFile(join(run, 'response.md'), 'utf8')
      let callsBefore = await runtime.calls()
      await runtime.setMode('success')
      await expect(runtime.resume()).resolves.toBe(0)
      let started = startedSince(await runtime.calls(), callsBefore)
      expect(started.map(call => [call.phase, call.model])).toStrictEqual([
        ['grader', 'grader-model'],
      ])
      let record = await readJson(join(run, 'result.json'))
      expect(record.status).toBe('completed')
      expect(record.grade.pass).toBe(true)
      expect(record.failedAttempts[0].phase).toBe('grader')
      expect(record.failedAttempts[0].status).toBe('failed')
      await expect(readFile(join(run, 'response.md'), 'utf8')).resolves.toBe(
        response,
      )
      await stat(join(run, 'grading.failed-1', 'stderr.log'))
    },
  )

  it(
    'resume grades a response whose grading was interrupted',
    LIVE,
    async () => {
      let runtime = await fakeRuntime('hang-grader')
      let controller = new AbortController()
      onTestFinished(() => controller.abort())
      let execution = runtime.start(
        [
          '--case',
          '33',
          '--runs',
          '1',
          '--grade',
          '--grader-model',
          'grader-model',
        ],
        { signal: controller.signal },
      )
      await waitForCalls(runtime.log)
      controller.abort()
      await expect(execution).resolves.toBe(1)
      let run = join(runtime.output, 'case-33', 'none', 'run-1')
      let aborted = await runtime.result(33, 'none', 1)
      expect(aborted.status).toBe('aborted')
      expect(aborted.writerStatus).toBe('completed')
      expect(aborted.gradingRun.status).toBe('failed')
      expect(aborted.error).toBe('Codex run was aborted.')
      await expect(stat(join(run, 'grading.failed-1'))).rejects.toMatchObject({
        code: 'ENOENT',
      })
      let summary = await readJson(join(runtime.output, 'summary.json'))
      expect(summary.execution.stopReason).toBe('Interrupted by signal.')
      let callsBefore = await runtime.calls()
      await runtime.setMode('success')
      await expect(runtime.resume(['--dry-run'])).resolves.toBe(0)
      expect(runtime.plan().plannedModelCalls).toStrictEqual({
        writer: 0,
        grader: 1,
        total: 1,
      })
      await expect(runtime.resume()).resolves.toBe(0)
      let started = startedSince(await runtime.calls(), callsBefore)
      expect(started.map(call => call.phase)).toStrictEqual(['grader'])
      let record = await runtime.result(33, 'none', 1)
      expect(record.status).toBe('completed')
      expect(record.failedAttempts).toStrictEqual([
        {
          artifacts: join('case-33', 'none', 'run-1', 'grading.failed-1'),
          error: 'Codex run was aborted.',
          status: 'failed',
          phase: 'grader',
        },
      ])
    },
  )

  it(
    'resume keeps saved settings and refuses a changed skill snapshot',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      await expect(runtime.start(['--variant', 'current'])).resolves.toBe(0)
      await expect(runtime.resume(['--model', 'other-model'])).rejects.toThrow(
        '--resume reuses the saved settings; --model cannot change them',
      )
      let callsBefore = await runtime.calls()
      await expect(runtime.resume()).resolves.toBe(0)
      expect(runtime.warn).not.toHaveBeenCalled()
      let skill = join(
        runtime.output,
        'snapshots',
        'current',
        'ghostwriter',
        'SKILL.md',
      )
      await writeFile(skill, `${await readFile(skill, 'utf8')}\nEdited.\n`)
      await expect(runtime.resume()).rejects.toThrow(
        'The current skill snapshot changed after this run started',
      )
      await expect(runtime.calls()).resolves.toHaveLength(callsBefore.length)
    },
  )

  it(
    'resume warns when the Codex CLI version changed and records every resume',
    LIVE,
    async () => {
      let runtime = await fakeRuntime()
      await expect(runtime.start(['--runs', '1'])).resolves.toBe(0)
      let manifestFile = join(runtime.output, 'manifest.json')
      await updateJson(manifestFile, manifest => ({
        ...manifest,
        cli: { ...manifest.cli, version: 'codex-cli 0.1.0' },
      }))
      await expect(runtime.resume()).resolves.toBe(0)
      await expect(runtime.resume(['--jobs', '3'])).resolves.toBe(0)
      let warning =
        'Codex CLI changed from codex-cli 0.1.0 to codex-cli fake; both are recorded in the manifest.'
      expect(runtime.warn.mock.calls).toStrictEqual([[warning], [warning]])
      let manifest = await readJson(manifestFile)
      expect(manifest.cli.version).toBe('codex-cli 0.1.0')
      expect(
        manifest.resumes.map(entry => [
          entry.cli.version,
          entry.reused,
          entry.remaining,
          entry.jobs,
        ]),
      ).toStrictEqual([
        ['codex-cli fake', 2, 0, 1],
        ['codex-cli fake', 2, 0, 3],
      ])
    },
  )

  it.each([
    {
      change: output =>
        updateJson(join(output, 'cases.json'), cases =>
          cases.filter(item => item.id !== 34),
        ),
      name: 'a removed case',
    },
    {
      change: output =>
        updateJson(join(output, 'manifest.json'), manifest => ({
          ...manifest,
          trials: undefined,
        })),
      name: 'missing planned trials',
    },
  ])(
    'resume refuses saved cases that do not match the planned trials: $name',
    LIVE,
    async ({ change }) => {
      let runtime = await fakeRuntime()
      await expect(runtime.start(['--runs', '1'])).resolves.toBe(0)
      await change(runtime.output)
      let calls = await runtime.calls()
      await expect(runtime.resume()).rejects.toThrow(
        'The saved cases do not match the planned trials',
      )
      await expect(runtime.calls()).resolves.toHaveLength(calls.length)
    },
  )

  it.each([
    {
      change: async output => {
        await rm(join(output, 'case-33'), { recursive: true })
        await writeFile(join(output, 'case-33'), '')
      },
      name: 'a case directory replaced by a file',
      error: /ENOTDIR/u,
    },
    {
      change: output =>
        writeFile(join(output, 'case-33', 'none', 'run-1', 'result.json'), '{'),
      name: 'a corrupt result',
      error: SyntaxError,
    },
  ])(
    'resume stops on $name instead of discarding saved work',
    LIVE,
    async ({ change, error }) => {
      let runtime = await fakeRuntime()
      await expect(runtime.start(['--runs', '1'])).resolves.toBe(0)
      await change(runtime.output)
      let calls = await runtime.calls()
      await expect(runtime.resume()).rejects.toThrow(error)
      await expect(runtime.calls()).resolves.toHaveLength(calls.length)
    },
  )
})
