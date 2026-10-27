import {
  writeFile,
  readFile,
  realpath,
  readdir,
  symlink,
  mkdtemp,
  chmod,
  lstat,
  mkdir,
  open,
  stat,
  rm,
} from 'node:fs/promises'
import { onTestFinished, describe, expect, it, vi } from 'vitest'
import { spawn } from 'node:child_process'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { detectCodexCLI, runCodex } from '../scripts/lib/codex-runner.js'

vi.mock(import('node:fs/promises'), async importOriginal => {
  let actual = await importOriginal()
  return { ...actual, lstat: vi.fn(actual.lstat), open: vi.fn(actual.open) }
})

vi.mock(import('node:child_process'), async importOriginal => {
  let actual = await importOriginal()
  return { ...actual, spawn: vi.fn(actual.spawn) }
})

async function fixture(mode = 'success') {
  let directory = await mkdtemp(join(tmpdir(), 'codex-runner-'))
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  let executable = join(directory, 'fake codex.cjs')
  let outputDirectory = join(directory, 'output')
  let binaries = join(directory, 'bin')
  await writeFile(
    executable,
    String.raw`#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const args = process.argv.slice(2);
const mode = ${JSON.stringify(mode)};
fs.appendFileSync(path.join(__dirname, 'calls.log'), JSON.stringify(args) + '\n');
if (args.includes('--version')) {
  if (mode === 'preflight-stderr') {
    console.error('codex: broken install');
    process.exitCode = 1;
  } else if (mode === 'preflight-silent') {
    process.exitCode = 1;
  } else if (mode === 'preflight-hang') {
    setInterval(() => {}, 1000);
  } else {
    console.log('codex-cli 0.164.0');
  }
} else if (args.includes('--help')) {
  console.log('--json --ephemeral --skip-git-repo-check --sandbox --model --config --enable --disable --output-last-message --output-schema' + (mode === 'unsupported' ? '' : ' --ignore-user-config'));
} else if (args[0] === 'features') {
  for (const name of ['skip_host_skill_discovery', 'plugins', 'apps', 'memories', 'multi_agent']) console.log(name + (mode === 'removed-feature' && name === 'memories' ? ' removed false' : ' stable false'));
} else if (mode === 'early-exit') {
  console.error('closed early');
  process.exit(3);
} else {
  const responsePath = args[args.indexOf('--output-last-message') + 1];
  const output = path.dirname(responsePath);
  let prompt = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => { prompt += chunk; });
  process.stdin.on('end', () => {
    fs.writeFileSync(path.join(output, 'invocation.json'), JSON.stringify({ args, prompt, cwd: process.cwd(), home: process.env.HOME, codexHome: process.env.CODEX_HOME }));
    if (mode === 'hang') {
      console.error('waiting');
      process.on('SIGTERM', () => {});
      setInterval(() => {}, 1000);
      fs.writeFileSync(path.join(output, 'codex.pid.tmp'), String(process.pid));
      fs.renameSync(path.join(output, 'codex.pid.tmp'), path.join(output, 'codex.pid'));
      return;
    }
    if (mode === 'timeout') {
      const descendant = spawn(process.execPath, ['-e', 'process.on("SIGTERM", () => {}); setInterval(() => {}, 1000)'], { stdio: 'ignore' });
      fs.writeFileSync(path.join(output, 'descendant.pid'), String(descendant.pid));
      process.on('SIGTERM', () => {});
      setInterval(() => {}, 1000);
      return;
    }
    const emit = event => console.log(JSON.stringify(event));
    console.error('diagnostic message');
    if (mode === 'response-directory') fs.mkdirSync(responsePath);
    else fs.writeFileSync(responsePath, mode === 'empty' ? ' ' : 'Final response.');
    emit({ type: 'item.started', item: { id: 'command-1', type: 'command_execution', command: 'cat rules/facts.md', status: 'in_progress' } });
    emit({ type: 'item.completed', item: { id: 'command-1', type: 'command_execution', command: 'cat rules/facts.md', status: 'completed', exit_code: 0, aggregated_output: '# Facts\nSource text.' } });
    if (mode === 'error') emit({ type: 'error', message: 'API failed.' });
    if (mode === 'turn-failed') emit({ type: 'turn.failed', error: { message: 'Turn failed.' } });
    if (mode === 'malformed') console.log('not JSON');
    if (mode.startsWith('lines:')) console.log(mode.slice('lines:'.length));
    if (mode !== 'incomplete') emit({ type: 'turn.completed', ...(mode === 'no-usage' ? {} : { usage: { input_tokens: 11, cached_input_tokens: 3, output_tokens: 7 } }) });
    if (mode === 'nonzero') process.exitCode = 2;
  });
}
`,
  )
  await chmod(executable, 0o755)
  await mkdir(binaries)
  await symlink(process.execPath, join(binaries, 'node'))
  await symlink(executable, join(binaries, 'codex'))
  vi.stubEnv('CODEX_HOME', join(directory, '.codex'))
  vi.stubEnv('HOME', directory)
  vi.stubEnv('PATH', binaries)
  onTestFinished(() => {
    vi.unstubAllEnvs()
  })
  return {
    prompt: 'Edit this text.',
    model: 'test-model',
    outputDirectory,
    cwd: directory,
    executable,
  }
}

describe('runCodex', () => {
  it(
    'preflight checks flags and features without starting a model',
    { timeout: 30_000 },
    async () => {
      let options = await fixture()
      let result = await detectCodexCLI(options)
      expect(result.ok).toBe(true)
      expect(result.version).toBe('codex-cli 0.164.0')
      expect(result.features).toContain('skip_host_skill_discovery')
      await expect(
        readFile(join(options.outputDirectory, 'invocation.json')),
      ).rejects.toMatchObject({ code: 'ENOENT' })
    },
  )

  it(
    'preflight fails clearly for an unsupported or missing executable',
    { timeout: 30_000 },
    async () => {
      let options = await fixture('unsupported')
      let unsupported = await runCodex(options)
      expect(unsupported.status).toBe('failed')
      expect(unsupported.error).toMatch(/ignore-user-config/u)
      await expect(
        readFile(join(options.outputDirectory, 'invocation.json')),
      ).rejects.toMatchObject({ code: 'ENOENT' })
      let missing = await detectCodexCLI({
        executable: join(options.cwd, 'missing'),
      })
      expect(missing.ok).toBe(false)
      expect(missing.error).toMatch(/ENOENT/u)
    },
  )

  it(
    'records real events, usage, command output, final text, and safe arguments',
    { timeout: 30_000 },
    async () => {
      let options = await fixture()
      let schemaPath = join(options.cwd, 'output schema.json')
      await writeFile(schemaPath, '{"type":"object"}')
      let result = await runCodex({
        ...options,
        disabledSkillPaths: [join(options.cwd, 'host skill', 'SKILL.md')],
        prompt: 'Literal $(touch forbidden) `command` text.',
        schemaPath,
      })
      expect(result).toEqual(expect.objectContaining({ status: 'completed' }))
      expect(result.response).toBe('Final response.')
      expect(result.usage).toStrictEqual(
        JSON.parse(
          '{"input_tokens":11,"cached_input_tokens":3,"output_tokens":7}',
        ),
      )
      expect(result.commands).toHaveLength(1)
      expect(result.commands[0].exitCode).toBe(0)
      expect(result.commands[0].output).toBe('# Facts\nSource text.')
      expect(result.durationMs).toBeGreaterThanOrEqual(0)
      await expect(readFile(result.tracePath, 'utf8')).resolves.toMatch(
        /turn.completed/u,
      )
      await expect(
        readFile(join(options.outputDirectory, 'stderr.log'), 'utf8'),
      ).resolves.toMatch(/diagnostic message/u)
      let invocation = JSON.parse(
        await readFile(
          join(options.outputDirectory, 'invocation.json'),
          'utf8',
        ),
      )
      expect(invocation.prompt).toBe(
        'Literal $(touch forbidden) `command` text.',
      )
      expect(invocation.args[invocation.args.indexOf('--sandbox') + 1]).toBe(
        'read-only',
      )
      expect(invocation.args[invocation.args.indexOf('--model') + 1]).toBe(
        options.model,
      )
      expect(
        invocation.args[invocation.args.indexOf('--output-schema') + 1],
      ).toBe(await realpath(schemaPath))
      expect(invocation.args).toContain('model_reasoning_effort="medium"')
      expect(invocation.args).toContain(
        `skills.config=[{path=${JSON.stringify(join(options.cwd, 'host skill', 'SKILL.md'))},enabled=false}]`,
      )
      expect(invocation.home).toBe(process.env.HOME)
      expect(invocation.codexHome).toBe(process.env.CODEX_HOME)
    },
  )

  it(
    'rejects event failures, incomplete turns, empty responses, malformed traces, and nonzero exits',
    { timeout: 30_000 },
    async () => {
      await Promise.all(
        [
          'error',
          'turn-failed',
          'incomplete',
          'empty',
          'malformed',
          'nonzero',
        ].map(async mode => {
          let result = await runCodex(await fixture(mode))
          expect({ ...result, mode }).toEqual(
            expect.objectContaining({
              error: expect.stringMatching(/./su),
              status: 'failed',
            }),
          )
        }),
      )
    },
  )

  it(
    'does not invent usage when the CLI provides none',
    { timeout: 30_000 },
    async () => {
      let result = await runCodex(await fixture('no-usage'))
      expect(result.status).toBe('completed')
      expect(result.usage).toBeNull()
    },
  )

  it('rejects relative skill paths before invoking Codex', async () => {
    let options = await fixture()
    await expect(
      runCodex({ ...options, disabledSkillPaths: ['r0/skill/SKILL.md'] }),
    ).rejects.toThrow(/absolute SKILL\.md paths/u)
  })

  it.skipIf(process.platform === 'win32')(
    'times out and cleans up a child process group',
    { timeout: 30_000 },
    async () => {
      let options = await fixture('timeout')
      let result = await runCodex({ ...options, timeoutMs: 300 })
      expect(result.status).toBe('timeout')
      expect(result.usage).toBeNull()
      let pid = Number(
        await readFile(join(options.outputDirectory, 'descendant.pid'), 'utf8'),
      )
      await waitForExit(pid)
      expect(() => process.kill(pid, 0)).toThrow(
        expect.objectContaining({ code: 'ESRCH' }),
      )
    },
  )

  it('preserves existing artifacts instead of overwriting them', async () => {
    let options = await fixture()
    await mkdir(options.outputDirectory)
    let response = join(options.outputDirectory, 'response.md')
    await writeFile(response, 'Keep this.')
    await expect(runCodex(options)).rejects.toThrow(/Refusing to overwrite/u)
    await expect(readFile(response, 'utf8')).resolves.toBe('Keep this.')
  })

  it(
    'an abort signal stops a running child without reporting success',
    { timeout: 30_000 },
    async () => {
      let options = await fixture('timeout')
      let controller = new AbortController()
      onTestFinished(() => controller.abort())
      let execution = runCodex({ ...options, signal: controller.signal })
      await waitForFile(join(options.outputDirectory, 'descendant.pid'))
      controller.abort()
      let result = await execution
      expect(result.status).toBe('failed')
      expect(result.error).toMatch(/aborted/u)
    },
  )

  it.each([
    ['outputDirectory', { outputDirectory: 42 }],
    ['reasoningEffort', { reasoningEffort: '' }],
    ['executable', { executable: '' }],
    ['prompt', { prompt: '' }],
    ['model', { model: ' '.repeat(3) }],
    ['cwd', { cwd: undefined }],
  ])('rejects an empty %s before starting codex', async (name, override) => {
    let options = await fixture()
    await expect(runCodex({ ...options, ...override })).rejects.toThrow(
      `${name} must be a nonempty string.`,
    )
    await expect(readCalls(options)).resolves.toStrictEqual([])
  })

  it.each([0, -1, 1.5, Number.NaN, '1000'])(
    'rejects a timeout of %o before starting codex',
    async timeoutMs => {
      let options = await fixture()
      await expect(runCodex({ ...options, timeoutMs })).rejects.toThrow(
        'timeoutMs must be a positive integer.',
      )
      await expect(detectCodexCLI({ ...options, timeoutMs })).rejects.toThrow(
        'timeoutMs must be a positive integer.',
      )
      await expect(readCalls(options)).resolves.toStrictEqual([])
    },
  )

  it('rejects a cwd that is not a directory', async () => {
    let options = await fixture()
    await expect(
      runCodex({ ...options, cwd: options.executable }),
    ).rejects.toThrow('cwd must be a directory.')
    await expect(stat(options.outputDirectory)).rejects.toMatchObject({
      code: 'ENOENT',
    })
    await expect(readCalls(options)).resolves.toStrictEqual([])
  })

  it('rejects an output directory that is a symbolic link', async () => {
    let options = await fixture()
    let target = join(options.cwd, 'elsewhere')
    await mkdir(target)
    await symlink(target, options.outputDirectory)
    await expect(runCodex(options)).rejects.toThrow(
      'outputDirectory must not be a symbolic link.',
    )
    await expect(readdir(target)).resolves.toStrictEqual([])
    await expect(readCalls(options)).resolves.toStrictEqual([])
  })

  it('keeps an existing stderr log instead of overwriting it', async () => {
    let options = await fixture()
    await mkdir(options.outputDirectory)
    let log = join(options.outputDirectory, 'stderr.log')
    await writeFile(log, 'Old log.')
    await expect(runCodex(options)).rejects.toMatchObject({ code: 'EEXIST' })
    await expect(readFile(log, 'utf8')).resolves.toBe('Old log.')
    await expect(readCalls(options)).resolves.toStrictEqual([])
  })

  it('rethrows an error other than a missing response file', async () => {
    let options = await fixture()
    let actual = await vi.importActual('node:fs/promises')
    let error = Object.assign(new Error('EACCES: permission denied, lstat'), {
      code: 'EACCES',
    })
    vi.mocked(lstat)
      .mockImplementationOnce(actual.lstat)
      .mockRejectedValueOnce(error)
    onTestFinished(() => {
      vi.mocked(lstat).mockReset()
    })
    await expect(runCodex(options)).rejects.toBe(error)
    await expect(readdir(options.outputDirectory)).resolves.toStrictEqual([])
    await expect(readCalls(options)).resolves.toStrictEqual([])
  })

  it('does not start codex when the signal is already aborted', async () => {
    let options = await fixture()
    let signal = AbortSignal.abort()
    await expect(detectCodexCLI({ ...options, signal })).resolves.toStrictEqual(
      {
        error: 'Codex run was aborted.',
        version: null,
        features: [],
        ok: false,
      },
    )
    let result = await runCodex({ ...options, signal })
    expect(result.status).toBe('failed')
    expect(result.error).toBe('Codex run was aborted.')
    await expect(
      readFile(join(options.outputDirectory, 'stderr.log'), 'utf8'),
    ).resolves.toBe('Codex run was aborted.\n')
    await expect(readFile(result.tracePath, 'utf8')).resolves.toBe('')
    await expect(readCalls(options)).resolves.toStrictEqual([])
  })

  it(
    'finds codex on PATH when no executable is given',
    { timeout: 30_000 },
    async () => {
      let options = await fixture()
      await expect(detectCodexCLI()).resolves.toMatchObject({
        version: 'codex-cli 0.164.0',
        ok: true,
      })
      let result = await runCodex({ ...options, executable: undefined })
      expect(result.status).toBe('completed')
      expect(result.response).toBe('Final response.')
      let calls = await readCalls(options)
      expect(calls).toHaveLength(7)
      expect(calls.at(-1)[0]).toBe('exec')
    },
  )

  it.each([
    {
      description: 'writes to stderr',
      error: 'codex: broken install',
      mode: 'preflight-stderr',
      version: null,
    },
    {
      error: 'Codex CLI preflight failed or timed out.',
      description: 'exits silently',
      mode: 'preflight-silent',
      version: null,
    },
    {
      error: 'Installed Codex CLI lacks required options/features: memories.',
      description: 'lists a required feature as removed',
      version: 'codex-cli 0.164.0',
      mode: 'removed-feature',
    },
  ])(
    'preflight fails when the installed codex $description',
    { timeout: 30_000 },
    async ({ version, error, mode }) => {
      let options = await fixture(mode)
      let result = await detectCodexCLI(options)
      expect(result.ok).toBe(false)
      expect(result.error).toBe(error)
      expect(result.version).toBe(version)
      expect(result.features).not.toContain('memories')
      let run = await runCodex(options)
      expect(run.status).toBe('failed')
      expect(run.error).toBe(error)
      await expect(
        readFile(join(options.outputDirectory, 'invocation.json')),
      ).rejects.toMatchObject({ code: 'ENOENT' })
    },
  )

  it(
    'preflight stops a command that does not finish in time',
    { timeout: 30_000 },
    async () => {
      let options = await fixture('preflight-hang')
      let result = await detectCodexCLI({ ...options, timeoutMs: 300 })
      expect(result).toStrictEqual({
        error: 'Codex CLI preflight failed or timed out.',
        version: null,
        features: [],
        ok: false,
      })
    },
  )

  it(
    'reports a schema path that is not a file without starting the run',
    { timeout: 30_000 },
    async () => {
      let options = await fixture()
      let result = await runCodex({ ...options, schemaPath: options.cwd })
      expect(result.status).toBe('failed')
      expect(result.error).toBe('schemaPath must be a file.')
      await expect(
        readFile(join(options.outputDirectory, 'invocation.json')),
      ).rejects.toMatchObject({ code: 'ENOENT' })
      await expect(readFile(result.tracePath, 'utf8')).resolves.toBe('')
    },
  )

  it(
    'reports a response path that cannot be read',
    { timeout: 30_000 },
    async () => {
      let result = await runCodex(await fixture('response-directory'))
      expect(result.status).toBe('failed')
      expect(result.error).toMatch(/^EISDIR/u)
      expect(result.response).toBe('')
      expect(result.commands).toHaveLength(1)
      expect(result.usage).toStrictEqual(
        JSON.parse(
          '{"input_tokens":11,"cached_input_tokens":3,"output_tokens":7}',
        ),
      )
    },
  )

  it.each([
    ['null', 'null', 'Codex emitted invalid JSONL.'],
    ['a number', '42', 'Codex emitted invalid JSONL.'],
    [
      'an event without a type',
      '{"message":"No type."}',
      'Codex emitted invalid JSONL.',
    ],
    [
      'a cancelled turn without a message',
      '{"type":"turn.cancelled"}',
      'Codex emitted turn.cancelled.',
    ],
  ])(
    'rejects a trace that contains %s',
    { timeout: 30_000 },
    async (_description, line, error) => {
      let result = await runCodex(await fixture(`lines:${line}`))
      expect(result.status).toBe('failed')
      expect(result.error).toBe(error)
      expect(result.response).toBe('Final response.')
    },
  )

  it(
    'sums usage across turns and skips invalid counters',
    { timeout: 30_000 },
    async () => {
      let result = await runCodex(
        await fixture(
          'lines:{"type":"turn.completed","usage":{"input_tokens":5,"output_tokens":-1,"cached_input_tokens":null,"reasoning_tokens":"many"}}',
        ),
      )
      expect(result.status).toBe('completed')
      expect(result.usage).toStrictEqual(
        JSON.parse(
          '{"input_tokens":16,"cached_input_tokens":3,"output_tokens":7}',
        ),
      )
    },
  )

  it(
    'merges command updates by id and keeps anonymous commands apart',
    { timeout: 30_000 },
    async () => {
      let lines = [
        '{"type":"item.started","item":{"id":"command-2","type":"command_execution","command":"ls","status":"in_progress"}}',
        '{"type":"item.completed","item":{"id":"command-2","type":"command_execution","exit_code":1,"aggregated_output":"missing"}}',
        '{"type":"item.completed","item":{"type":"command_execution","command":"pwd"}}',
        '{"type":"item.completed","item":{"type":"command_execution"}}',
      ]
      let result = await runCodex(await fixture(`lines:${lines.join('\n')}`))
      expect(result.status).toBe('completed')
      expect(result.commands).toStrictEqual([
        {
          output: '# Facts\nSource text.',
          command: 'cat rules/facts.md',
          status: 'completed',
          id: 'command-1',
          exitCode: 0,
        },
        {
          status: 'in_progress',
          output: 'missing',
          id: 'command-2',
          command: 'ls',
          exitCode: 1,
        },
        {
          command: 'pwd',
          exitCode: null,
          status: null,
          output: '',
          id: null,
        },
        { exitCode: null, status: null, command: '', output: '', id: null },
      ])
    },
  )

  it(
    'reports the exit status when codex closes stdin early',
    { timeout: 30_000 },
    async () => {
      let options = await fixture('early-exit')
      let result = await runCodex({
        ...options,
        prompt: 'Long prompt. '.repeat(100_000),
      })
      expect(result.status).toBe('failed')
      expect(result.error).toBe('Codex exited with 3: closed early')
    },
  )

  it(
    'reports a stdin failure other than a closed pipe',
    { timeout: 30_000 },
    async () => {
      let options = await fixture()
      let actual = await vi.importActual('node:child_process')
      let error = Object.assign(new Error('write ECONNRESET'), {
        code: 'ECONNRESET',
      })
      vi.mocked(spawn).mockImplementationOnce((...arguments_) => {
        let child = actual.spawn(...arguments_)
        child.stdin.destroy(error)
        return child
      })
      onTestFinished(() => {
        vi.mocked(spawn).mockReset()
      })
      await expect(detectCodexCLI(options)).resolves.toStrictEqual({
        version: 'codex-cli 0.164.0',
        error: 'write ECONNRESET',
        features: [],
        ok: false,
      })
    },
  )

  it(
    'stops codex and fails the run when the trace cannot be saved',
    { timeout: 30_000 },
    async () => {
      let options = await fixture()
      let actual = await vi.importActual('node:fs/promises')
      let error = Object.assign(
        new Error('ENOSPC: no space left on device, write'),
        { code: 'ENOSPC' },
      )
      vi.mocked(open).mockImplementationOnce(async (...arguments_) => {
        let handle = await actual.open(...arguments_)
        handle.write = () => Promise.reject(error)
        handle.writev = () => Promise.reject(error)
        return handle
      })
      onTestFinished(() => {
        vi.mocked(open).mockReset()
      })
      let result = await runCodex(options)
      expect(result.status).toBe('failed')
      expect(result.error).toBe(
        'Cannot save Codex trace: ENOSPC: no space left on device, write',
      )
      expect(result.commands).toStrictEqual([])
      expect(result.usage).toBeNull()
      await expect(readFile(result.tracePath, 'utf8')).resolves.toBe('')
    },
  )

  it('reports when codex cannot be signaled', { timeout: 30_000 }, async () => {
    let options = await fixture()
    let error = Object.assign(new Error('kill EPERM'), { code: 'EPERM' })
    let kill = vi.spyOn(process, 'kill').mockImplementation(() => {
      throw error
    })
    onTestFinished(() => {
      kill.mockRestore()
    })
    let result = await detectCodexCLI(options)
    expect(result).toStrictEqual({
      error: 'Cannot stop Codex: kill EPERM',
      version: 'codex-cli 0.164.0',
      features: [],
      ok: false,
    })
    expect(kill.mock.calls[0][0]).toBeLessThan(0)
    expect(kill.mock.calls[0][1]).toBe('SIGTERM')
  })

  it(
    'stops codex directly instead of a process group on windows',
    { timeout: 30_000 },
    async () => {
      let options = await fixture('hang')
      let platform = Object.getOwnPropertyDescriptor(process, 'platform')
      Object.defineProperty(process, 'platform', {
        ...platform,
        value: 'win32',
      })
      onTestFinished(() => {
        Object.defineProperty(process, 'platform', platform)
      })
      let kill = vi.spyOn(process, 'kill')
      onTestFinished(() => {
        kill.mockRestore()
      })
      let controller = new AbortController()
      let execution = runCodex({ ...options, signal: controller.signal })
      let pid = Number(
        await waitForFile(join(options.outputDirectory, 'codex.pid')),
      )
      controller.abort()
      let result = await execution
      expect(result.status).toBe('failed')
      expect(result.error).toBe('Codex run was aborted.')
      expect(kill).not.toHaveBeenCalled()
      expect(() => process.kill(pid, 0)).toThrow(
        expect.objectContaining({ code: 'ESRCH' }),
      )
    },
  )

  it(
    'kills running codex when the parent process exits',
    { timeout: 30_000 },
    async () => {
      let options = await fixture('hang')
      let listeners = process.listeners('exit')
      let execution = runCodex({ ...options, timeoutMs: 20_000 })
      await waitForFile(join(options.outputDirectory, 'codex.pid'))
      let hooks = process
        .listeners('exit')
        .filter(listener => !listeners.includes(listener))
      expect(hooks).toHaveLength(1)
      hooks[0]()
      let result = await execution
      expect(result.status).toBe('failed')
      expect(result.error).toBe('Codex exited with SIGKILL: waiting')
      expect(process.listeners('exit')).toStrictEqual(listeners)
    },
  )
})

async function waitForFile(path, attempts = 100) {
  try {
    return await readFile(path, 'utf8')
  } catch (error) {
    if (attempts === 0 || error.code !== 'ENOENT') {
      throw error
    }
    await new Promise(resolve => {
      setTimeout(resolve, 50)
    })
    return waitForFile(path, attempts - 1)
  }
}

async function readCalls(options) {
  try {
    let log = await readFile(join(options.cwd, 'calls.log'), 'utf8')
    return log
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

async function waitForExit(pid, attempts = 100) {
  try {
    process.kill(pid, 0)
  } catch {
    return
  }
  if (attempts > 0) {
    await new Promise(resolve => {
      setTimeout(resolve, 50)
    })
    await waitForExit(pid, attempts - 1)
  }
}
