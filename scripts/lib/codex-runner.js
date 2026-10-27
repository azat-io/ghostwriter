import { readFile, realpath, mkdir, lstat, open, stat } from 'node:fs/promises'
import { finished } from 'node:stream/promises'
import { isAbsolute, join } from 'node:path'
import { spawn } from 'node:child_process'

const REQUIRED_FLAGS = [
  '--json',
  '--ephemeral',
  '--ignore-user-config',
  '--skip-git-repo-check',
  '--sandbox',
  '--model',
  '--config',
  '--enable',
  '--disable',
  '--output-last-message',
  '--output-schema',
]
const DISABLED_FEATURES = ['plugins', 'apps', 'memories', 'multi_agent']
const REQUIRED_FEATURES = ['skip_host_skill_discovery', ...DISABLED_FEATURES]
const PROCESS_CLEANUP = new Set()

/**
 * The caller supplies a scratch cwd and a new output directory for every run.
 *
 * @param {object} options - Prompt, paths, model, and process settings.
 * @returns {Promise<object>} Execution status, response, trace path, and
 *   observed usage.
 */
export async function runCodex(options) {
  let {
    reasoningEffort = 'medium',
    disabledSkillPaths = [],
    executable = 'codex',
    timeoutMs = 180000,
    outputDirectory,
    schemaPath,
    prompt,
    signal,
    model,
    cwd,
  } = options
  validateTimeout(timeoutMs)
  if (
    !Array.isArray(disabledSkillPaths) ||
    disabledSkillPaths.some(
      path => typeof path !== 'string' || !isAbsolute(path),
    )
  ) {
    throw new Error('disabledSkillPaths must contain absolute SKILL.md paths.')
  }
  let required = Object.entries({
    outputDirectory,
    reasoningEffort,
    executable,
    prompt,
    model,
    cwd,
  })
  for (let [name, value] of required) {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error(`${name} must be a nonempty string.`)
    }
  }
  let started = Date.now()
  let workingDirectory = await realpath(cwd)
  if (!(await stat(workingDirectory)).isDirectory()) {
    throw new Error('cwd must be a directory.')
  }
  await mkdir(outputDirectory, { recursive: true })
  if ((await lstat(outputDirectory)).isSymbolicLink()) {
    throw new Error('outputDirectory must not be a symbolic link.')
  }
  let output = await realpath(outputDirectory)
  let tracePath = join(output, 'trace.jsonl')
  let stderrPath = join(output, 'stderr.log')
  let responsePath = join(output, 'response.md')
  await requireNewPath(responsePath)
  let traceFile = await open(tracePath, 'wx')
  let stderrFile
  try {
    stderrFile = await open(stderrPath, 'wx')
  } catch (error) {
    await traceFile.close()
    throw error
  }
  let trace = traceFile.createWriteStream()
  let stderr = stderrFile.createWriteStream()
  let result = {
    status: 'failed',
    durationMs: 0,
    response: '',
    commands: [],
    usage: null,
    error: null,
    tracePath,
  }
  try {
    let preflight = await detectCodexCLI({ executable, signal })
    if (!preflight.ok) {
      result.error = preflight.error
      stderr.end(`${preflight.error}\n`)
      trace.end()
      await Promise.all([finished(trace), finished(stderr)])
      return { ...result, durationMs: Date.now() - started }
    }
    let arguments_ = [
      'exec',
      '--json',
      '--ephemeral',
      '--ignore-user-config',
      '--skip-git-repo-check',
      '--sandbox',
      'read-only',
      '--model',
      model,
      '-c',
      'project_doc_max_bytes=0',
      '-c',
      'web_search="disabled"',
      '-c',
      `model_reasoning_effort=${JSON.stringify(reasoningEffort)}`,
      '--enable',
      'skip_host_skill_discovery',
      ...DISABLED_FEATURES.flatMap(feature => ['--disable', feature]),
      '--output-last-message',
      responsePath,
    ]
    if (schemaPath) {
      let schema = await realpath(schemaPath)
      if (!(await stat(schema)).isFile()) {
        throw new Error('schemaPath must be a file.')
      }
      arguments_.push('--output-schema', schema)
    }
    if (disabledSkillPaths.length > 0) {
      let settings = disabledSkillPaths
        .map(path => `{path=${JSON.stringify(path)},enabled=false}`)
        .join(',')
      arguments_.push('-c', `skills.config=[${settings}]`)
    }
    arguments_.push('-')
    let processResult = await runProcess({
      cwd: workingDirectory,
      args: arguments_,
      input: prompt,
      log: stderr,
      executable,
      timeoutMs,
      signal,
      trace,
    })
    let parsed = parseTrace(await readFile(tracePath, 'utf8'))
    result.usage = parsed.usage
    result.commands = parsed.commands
    try {
      result.response = await readFile(responsePath, 'utf8')
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error
      }
    }
    if (processResult.timedOut) {
      result.status = 'timeout'
      result.error = `Codex exceeded ${timeoutMs} ms.`
    } else {
      result.error =
        processResult.error ||
        (processResult.exitCode === 0 ?
          null
        : `Codex exited with ${processResult.signal || processResult.exitCode}: ${processResult.stderr.trim()}`) ||
        parsed.error ||
        (parsed.completed ? null : 'Codex did not emit turn.completed.') ||
        (result.response.trim() ? null : 'Codex returned no final response.')
      if (!result.error) {
        result.status = 'completed'
      }
    }
  } catch (error) {
    result.error = error.message
    trace.end()
    stderr.end()
    await Promise.allSettled([finished(trace), finished(stderr)])
  }
  result.durationMs = Date.now() - started
  return result
}

/**
 * This checks the installed command, not account access or model availability.
 *
 * @param {object} options - Executable, timeout, and optional abort signal.
 * @returns {Promise<object>} Supported flags/features or a preflight error.
 */
export async function detectCodexCLI(options = {}) {
  let { executable = 'codex', timeoutMs = 10000, signal } = options
  validateTimeout(timeoutMs)
  let results = await Promise.all(
    [['--version'], ['exec', '--help'], ['features', 'list']].map(arguments_ =>
      runProcess({ args: arguments_, executable, timeoutMs, signal }),
    ),
  )
  let version = results[0].stdout.trim() || null
  let failure = results.find(
    result => result.error || result.timedOut || result.exitCode !== 0,
  )
  if (failure) {
    return {
      error:
        failure.error ||
        failure.stderr.trim() ||
        'Codex CLI preflight failed or timed out.',
      features: [],
      ok: false,
      version,
    }
  }
  let flags = new Set(results[1].stdout.match(/--[\d\-a-z]+/gu))
  let missingFlags = REQUIRED_FLAGS.filter(flag => !flags.has(flag))
  let features = results[2].stdout.split('\n').flatMap(line => {
    let columns = line.trim().split(/\s+/u)
    return (
        columns.length >= 3 &&
          columns[1] !== 'removed' &&
          ['false', 'true'].includes(columns.at(-1))
      ) ?
        [columns[0]]
      : []
  })
  let missingFeatures = REQUIRED_FEATURES.filter(
    feature => !features.includes(feature),
  )
  let missing = [...missingFlags, ...missingFeatures]
  return {
    error:
      missing.length > 0 ?
        `Installed Codex CLI lacks required options/features: ${missing.join(', ')}.`
      : null,
    ok: missing.length === 0,
    features,
    version,
  }
}

async function runProcess({
  executable,
  input = '',
  timeoutMs,
  signal,
  trace,
  args,
  cwd,
  log,
}) {
  let result = {
    timedOut: false,
    exitCode: null,
    signal: null,
    error: null,
    stdout: '',
    stderr: '',
  }
  if (signal?.aborted) {
    trace?.end()
    log?.end()
    result.error = 'Codex run was aborted.'
    return result
  }
  let child = spawn(executable, args, {
    detached: process.platform !== 'win32',
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: false,
    cwd,
  })
  let timer
  let killTimer
  function signalGroup(processSignal) {
    if (!child.pid) {
      return
    }
    try {
      if (process.platform === 'win32') {
        child.kill(processSignal)
      } else {
        process.kill(-child.pid, processSignal)
      }
    } catch (error) {
      if (error.code !== 'ESRCH') {
        result.error ??= `Cannot stop Codex: ${error.message}`
      }
    }
  }
  function stop() {
    signalGroup('SIGTERM')
    killTimer ??= setTimeout(() => signalGroup('SIGKILL'), 250)
  }
  function abort() {
    result.error = 'Codex run was aborted.'
    stop()
  }
  function cleanup() {
    signalGroup('SIGKILL')
  }
  signal?.addEventListener('abort', abort, { once: true })
  if (PROCESS_CLEANUP.size === 0) {
    process.once('exit', cleanupProcesses)
  }
  PROCESS_CLEANUP.add(cleanup)
  child.stdout.setEncoding('utf8')
  child.stderr.setEncoding('utf8')
  child.stdout.on('data', chunk => {
    if (!trace) {
      result.stdout += chunk
    }
  })
  child.stderr.on('data', chunk => {
    result.stderr = (result.stderr + chunk).slice(-8192)
  })
  let writes = []
  if (trace) {
    child.stdout.pipe(trace)
    writes.push(finished(trace))
  }
  if (log) {
    child.stderr.pipe(log)
    writes.push(finished(log))
  }
  async function finishWrites() {
    try {
      await Promise.all(writes)
    } catch (error) {
      result.error = `Cannot save Codex trace: ${error.message}`
      stop()
    }
  }
  let writeCompletion = finishWrites()
  child.stdin.on('error', error => {
    if (error.code !== 'EPIPE') {
      result.error ??= error.message
    }
  })
  child.on('error', error => {
    result.error = error.message
  })
  child.once('exit', stop)
  timer = setTimeout(() => {
    result.timedOut = true
    stop()
  }, timeoutMs)
  child.stdin.end(input)
  await new Promise(resolve => {
    child.once('close', (code, exitSignal) => {
      result.exitCode = code
      result.signal = exitSignal
      clearTimeout(timer)
      clearTimeout(killTimer)
      signal?.removeEventListener('abort', abort)
      PROCESS_CLEANUP.delete(cleanup)
      if (PROCESS_CLEANUP.size === 0) {
        process.removeListener('exit', cleanupProcesses)
      }
      signalGroup('SIGKILL')
      resolve()
    })
  })
  await writeCompletion
  return result
}

function parseTrace(text) {
  let result = { completed: false, commands: [], error: null, usage: null }
  let commands = new Map()
  for (let line of text.split('\n')) {
    if (!line.trim()) {
      continue
    }
    let event
    try {
      event = JSON.parse(line)
      if (
        !event ||
        typeof event !== 'object' ||
        typeof event.type !== 'string'
      ) {
        throw new Error('Missing event type.')
      }
    } catch {
      result.error ??= 'Codex emitted invalid JSONL.'
      continue
    }
    if (['turn.cancelled', 'turn.failed', 'error'].includes(event.type)) {
      result.error ??=
        event.error?.message || event.message || `Codex emitted ${event.type}.`
    } else if (event.type === 'turn.completed') {
      result.completed = true
      if (event.usage && typeof event.usage === 'object') {
        for (let [key, value] of Object.entries(event.usage)) {
          if (
            typeof value === 'number' &&
            Number.isFinite(value) &&
            value >= 0
          ) {
            result.usage ??= {}
            result.usage[key] = (result.usage[key] ?? 0) + value
          }
        }
      }
    }
    if (event.item?.type === 'command_execution') {
      let { item } = event
      let key = item.id ?? `anonymous-${commands.size}`
      let previous = commands.get(key)
      commands.set(key, {
        output: item.aggregated_output ?? previous?.output ?? '',
        exitCode: item.exit_code ?? previous?.exitCode ?? null,
        command: item.command ?? previous?.command ?? '',
        status: item.status ?? previous?.status ?? null,
        id: item.id ?? null,
      })
    }
  }
  result.commands = commands.values().toArray()
  return result
}

async function requireNewPath(path) {
  try {
    await lstat(path)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return
    }
    throw error
  }
  throw new Error(`Refusing to overwrite existing artifact: ${path}`)
}

function validateTimeout(timeoutMs) {
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs <= 0) {
    throw new Error('timeoutMs must be a positive integer.')
  }
}

function cleanupProcesses() {
  for (let cleanup of PROCESS_CLEANUP) {
    cleanup()
  }
}
