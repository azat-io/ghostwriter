import {
  writeFile,
  readFile,
  realpath,
  mkdtemp,
  readdir,
  rename,
  mkdir,
  lstat,
  cp,
  rm,
} from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'
import { parseDocument } from 'yaml'
import { tmpdir } from 'node:os'
import path from 'node:path'

import {
  observeSkillRead,
  gradingPrompt,
  gradingSchema,
  fingerprint,
  fixturePath,
  selectCases,
  parseGrade,
  taskPrompt,
  readSuite,
  summarize,
} from './evaluation.js'
import { detectCodexCLI, runCodex } from './codex-runner.js'
import { discoverHostSkills } from './host-skills.js'
import { runTrialQueue } from './trial-queue.js'

let projectRoot = fileURLToPath(new URL('../../', import.meta.url))
let help = `Run Ghostwriter evaluations with Codex (model calls use your account).

  pnpm eval --list
  pnpm eval --case readme-for-office-staff --model WRITER --grade --grader-model GRADER
  pnpm eval --suite triggers --all --model MODEL --runs 3
  pnpm eval --all --variant current,previous --baseline /path/to/old/ghostwriter --model WRITER --grade --grader-model GRADER --jobs 2
  pnpm eval --resume .eval-results/TIME --jobs 2

Options:
  --suite regression|triggers    Default: regression
  --case ID,NAME                 Select cases in the chosen split
  --all                         Explicitly select the whole split
  --split dev|holdout            Default: dev
  --variant current,none,previous|all  Unique comma-separated variants; default: all
  --baseline PATH               Add a previous skill snapshot to all
  --model MODEL                 Required for model runs
  --effort low|medium|high|max   Default: medium; supported values depend on model
  --runs N                      Independent repetitions, default: 1
  --jobs N                      Concurrent trials/model calls, default: 1
  --retries N                   Extra attempts after a failed or timed-out model call, default: 1
  --timeout SECONDS             Per model call, default: 180
  --grade                       Run an independent structured grader
  --grader-model MODEL          Required for live --grade; no automatic fallback
  --grader-effort low|medium|high|max  Default: medium
  --output PATH                 New results directory, default: .eval-results/TIME
  --resume PATH                 Finish an interrupted run with its saved settings
  --list                        List cases; no model calls
  --dry-run                     Show plan; no model calls or output files

Trigger runs test selection from a controlled catalog. They do not prove native
skill discovery in every client. Grading is model-assisted: inspect the evidence.
`
let resumeOptions = new Set(['dry-run', 'retries', 'resume', 'jobs'])

/**
 * Run the evaluation CLI.
 *
 * @param {string[]} arguments_ - Command-line arguments after the script path.
 * @param {object} [options] - Signal that stops the run, as on SIGINT, and the
 *   project root that holds the suites, rubric, and current skill.
 * @returns {Promise<number>} Exit code for the process.
 */
export async function runEvaluations(
  arguments_,
  { root = projectRoot, signal } = {},
) {
  let { values, tokens } = parseArgs({
    options: {
      'grader-effort': { default: 'medium', type: 'string' },
      suite: { default: 'regression', type: 'string' },
      effort: { default: 'medium', type: 'string' },
      variant: { type: 'string', default: 'all' },
      timeout: { type: 'string', default: '180' },
      retries: { type: 'string', default: '1' },
      split: { type: 'string', default: 'dev' },
      runs: { type: 'string', default: '1' },
      jobs: { type: 'string', default: '1' },
      'grader-model': { type: 'string' },
      'dry-run': { type: 'boolean' },
      baseline: { type: 'string' },
      output: { type: 'string' },
      resume: { type: 'string' },
      grade: { type: 'boolean' },
      model: { type: 'string' },
      list: { type: 'boolean' },
      help: { type: 'boolean' },
      case: { type: 'string' },
      all: { type: 'boolean' },
    },
    args: arguments_,
    tokens: true,
  })
  if (values.help || arguments_.length === 0) {
    console.info(help)
    return 0
  }
  let jobs = Number(values.jobs)
  let retries = Number(values.retries)
  if (!Number.isSafeInteger(jobs) || jobs < 1) {
    throw new Error('--jobs must be a positive integer')
  }
  if (!Number.isSafeInteger(retries) || retries < 0 || retries > 10) {
    throw new Error('--retries must be 0–10')
  }
  if (values.resume !== undefined) {
    let given = tokens.filter(token => token.kind === 'option')
    let fixed = given.find(token => !resumeOptions.has(token.name))
    if (fixed) {
      throw new Error(
        `--resume reuses the saved settings; --${fixed.name} cannot change them`,
      )
    }
    return resume(values, { retries, signal, jobs, root })
  }
  let choicesByOption = {
    'grader-effort': ['low', 'medium', 'high', 'max'],
    effort: ['low', 'medium', 'high', 'max'],
    suite: ['regression', 'triggers'],
    split: ['dev', 'holdout'],
  }
  for (let [key, choices] of Object.entries(choicesByOption)) {
    if (!choices.includes(values[key])) {
      throw new Error(`Invalid --${key}`)
    }
  }
  let runs = Number(values.runs)
  let timeoutMs = Number(values.timeout) * 1000
  if (!Number.isSafeInteger(runs) || runs < 1 || runs > 100) {
    throw new Error('--runs must be 1–100')
  }
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1000) {
    throw new Error('--timeout must be a positive number of seconds')
  }
  if (values.case && values.all) {
    throw new Error('Choose --case or --all, not both')
  }
  let suiteFile = suitePath(root, values.suite)
  let cases = selectCases(
    await readSuite(suiteFile, values.suite),
    values.case,
    values.split,
  )
  if (values.list) {
    for (let item of cases) {
      console.info(`${String(item.id)}\t${item.name ?? item.prompt}`)
    }
    return 0
  }
  let requestedVariants = values.variant.split(',')
  let uniqueVariants = new Set(requestedVariants)
  if (
    uniqueVariants.size !== requestedVariants.length ||
    requestedVariants.some(
      variant => !['previous', 'current', 'none', 'all'].includes(variant),
    ) ||
    (requestedVariants.includes('all') && requestedVariants.length !== 1)
  ) {
    throw new Error(
      '--variant needs unique current,none,previous values, or all alone',
    )
  }
  let variants =
    requestedVariants.includes('all') ?
      ['current', 'none', ...(values.baseline ? ['previous'] : [])]
    : requestedVariants
  if (values.suite === 'triggers') {
    if (values.grade || requestedVariants.includes('none')) {
      throw new Error(
        'Trigger runs use observed reads, not grading or a no-skill variant',
      )
    }
    variants = variants.filter(variant => variant !== 'none')
  }
  if (variants.includes('previous') && !values.baseline) {
    throw new Error('--variant previous needs --baseline')
  }
  if (values['grader-model'] && !values.grade) {
    throw new Error('--grader-model requires --grade')
  }
  let trials = planTrials(cases, variants, runs)
  let planned = plannedMetrics(cases, variants, runs)
  let modelCalls = trials.length * (values.grade ? 2 : 1)
  let plan = {
    grader:
      values.grade ?
        {
          model: values['grader-model'] ?? null,
          effort: values['grader-effort'],
        }
      : null,
    sameModel:
      values.grade && values.model && values['grader-model'] ?
        values.model === values['grader-model']
      : null,
    plannedModelCalls: {
      grader: values.grade ? trials.length : 0,
      writer: trials.length,
      total: modelCalls,
    },
    writer: { model: values.model ?? null, effort: values.effort },
    cases: cases.map(item => item.name ?? item.id),
    trials: trials.map(trialMetadata),
    model: values.model ?? null,
    suite: values.suite,
    split: values.split,
    modelCalls,
    variants,
    planned,
    retries,
    jobs,
    runs,
  }
  if (values['dry-run']) {
    console.info(JSON.stringify({ ...plan, trials: undefined }, null, 2))
    return 0
  }
  if (!values.model?.trim()) {
    throw new Error('Choose an explicit --model for a repeatable run')
  }
  if (values.grade && !values['grader-model']?.trim()) {
    throw new Error('Choose an explicit --grader-model with --grade')
  }
  if (!values.case && !values.all) {
    throw new Error('Select --case or --all before making model calls')
  }
  let cli = await detectCodexCLI({ signal })
  if (!cli.ok) {
    throw new Error(cli.error)
  }
  let disabledSkillPaths = await discoverHostSkills()
  let startDate = new Date()
  let startedAt = startDate.toISOString()
  let outputDirectory = await resolveNewPath(
    path.resolve(
      values.output ??
        path.join(root, '.eval-results', startedAt.replaceAll(':', '-')),
    ),
  )
  let skillVariants = variants.filter(name => name !== 'none')
  let sources = Object.fromEntries(
    await Promise.all(
      skillVariants.map(async variant => {
        let source =
          variant === 'current' ?
            path.join(root, 'skills/ghostwriter')
          : path.resolve(values.baseline)
        // Reject symlinks before copying, including the root of a supplied snapshot.
        await fingerprint(source)
        let resolved = await realpath(source)
        let outputRelative = path.relative(resolved, outputDirectory)
        if (
          !outputRelative.startsWith('..') &&
          !path.isAbsolute(outputRelative)
        ) {
          throw new Error('Results must be outside the source skill directory')
        }
        return [variant, resolved]
      }),
    ),
  )
  await mkdir(path.dirname(outputDirectory), { recursive: true })
  await mkdir(outputDirectory)
  let rubric = await readFile(path.join(root, 'test/rubric.md'), 'utf8')
  let snapshots = Object.fromEntries(
    await Promise.all(
      skillVariants.map(async variant => {
        let destination = snapshotDirectory(outputDirectory, variant)
        await cp(sources[variant], destination, {
          errorOnExist: true,
          recursive: true,
        })
        return [variant, await readSnapshot(destination, sources[variant])]
      }),
    ),
  )
  await saveJson(path.join(outputDirectory, 'manifest.json'), {
    ...plan,
    triggerMethod:
      values.suite === 'triggers' ?
        'controlled-catalog-observed-command-output'
      : null,
    suiteSha256: await hashFile(suiteFile),
    effort: values.effort,
    disabledSkillPaths,
    startedAt,
    timeoutMs,
    snapshots,
    cli,
  })
  // Expectations stay in the report. Only prompts and input files reach task workspaces.
  await saveJson(path.join(outputDirectory, 'cases.json'), cases)
  await writeFile(path.join(outputDirectory, 'rubric.md'), rubric)
  return executeRun({
    settings: {
      graderEffort: values['grader-effort'],
      graderModel: values['grader-model'],
      grade: Boolean(values.grade),
      effort: values.effort,
      model: values.model,
      suite: values.suite,
      timeoutMs,
      retries,
    },
    disabledSkillPaths,
    outputDirectory,
    reused: [],
    suiteFile,
    snapshots,
    planned,
    rubric,
    trials,
    signal,
    jobs,
  })
}

async function resume(values, { retries, signal, jobs, root }) {
  let outputDirectory = await realpath(path.resolve(values.resume))
  let manifest = await readJson(path.join(outputDirectory, 'manifest.json'))
  if (
    typeof manifest.suiteSha256 !== 'string' ||
    !Number.isSafeInteger(manifest.timeoutMs) ||
    !Array.isArray(manifest.variants) ||
    !Number.isSafeInteger(manifest.runs) ||
    typeof manifest.writer?.model !== 'string' ||
    !manifest.snapshots ||
    !('grader' in manifest)
  ) {
    throw new Error(
      `Cannot resume ${outputDirectory}: its manifest predates --resume`,
    )
  }
  let suiteFile = suitePath(root, manifest.suite)
  if ((await hashFile(suiteFile)) !== manifest.suiteSha256) {
    throw new Error(
      'The suite changed after this run started; start a new run instead',
    )
  }
  let cases = await readJson(path.join(outputDirectory, 'cases.json'))
  let rubric = await readFile(path.join(outputDirectory, 'rubric.md'), 'utf8')
  let snapshots = Object.fromEntries(
    await Promise.all(
      manifest.variants
        .filter(variant => variant !== 'none')
        .map(async variant => {
          let snapshot = await readSnapshot(
            snapshotDirectory(outputDirectory, variant),
          )
          if (snapshot.sha256 !== manifest.snapshots[variant]?.sha256) {
            throw new Error(
              `The ${variant} skill snapshot changed after this run started`,
            )
          }
          return [variant, snapshot]
        }),
    ),
  )
  let trials = planTrials(cases, manifest.variants, manifest.runs)
  let trialKeys = trials.map(trial => trialKey(trialMetadata(trial)))
  if (
    !Array.isArray(manifest.trials) ||
    manifest.trials.map(trialKey).join('\n') !== trialKeys.join('\n')
  ) {
    throw new Error('The saved cases do not match the planned trials')
  }
  let settings = {
    graderEffort: manifest.grader?.effort,
    graderModel: manifest.grader?.model,
    grade: manifest.grader !== null,
    effort: manifest.writer.effort,
    timeoutMs: manifest.timeoutMs,
    model: manifest.writer.model,
    suite: manifest.suite,
    retries,
  }
  let states = await Promise.all(
    trials.map(trial => previousState(outputDirectory, trial)),
  )
  let reused = states.flatMap(state =>
    state.record?.status === 'completed' ? [state.record] : [],
  )
  let remaining = trials.flatMap((trial, index) => {
    let { record, exists } = states[index]
    if (record?.status === 'completed') {
      return []
    }
    // A finished writer response needs only a new grade.
    let regrade =
      settings.grade &&
      ['grading_failed', 'aborted'].includes(record?.status) &&
      record.writerStatus === 'completed'
    return [{ ...trial, previous: exists ? { regrade, record } : null }]
  })
  let writerCalls = remaining.filter(trial => !trial.previous?.regrade).length
  let plan = {
    plannedModelCalls: {
      total: writerCalls + (settings.grade ? remaining.length : 0),
      grader: settings.grade ? remaining.length : 0,
      writer: writerCalls,
    },
    remaining: remaining.length,
    reused: reused.length,
    outputDirectory,
    retries,
    jobs,
  }
  if (values['dry-run']) {
    console.info(JSON.stringify(plan, null, 2))
    return 0
  }
  let cli = await detectCodexCLI({ signal })
  if (!cli.ok) {
    throw new Error(cli.error)
  }
  if (cli.version !== manifest.cli?.version) {
    console.warn(
      `Codex CLI changed from ${manifest.cli?.version} to ${cli.version}; both are recorded in the manifest.`,
    )
  }
  let disabledSkillPaths = await discoverHostSkills()
  let resumedAt = new Date()
  await saveJson(path.join(outputDirectory, 'manifest.json'), {
    ...manifest,
    resumes: [
      ...(manifest.resumes ?? []),
      {
        startedAt: resumedAt.toISOString(),
        disabledSkillPaths,
        ...plan,
        cli,
      },
    ],
  })
  return executeRun({
    planned: plannedMetrics(cases, manifest.variants, manifest.runs),
    disabledSkillPaths,
    trials: remaining,
    outputDirectory,
    suiteFile,
    snapshots,
    settings,
    signal,
    reused,
    rubric,
    jobs,
  })
}

async function executeRun({
  disabledSkillPaths,
  outputDirectory,
  suiteFile,
  snapshots,
  settings,
  planned,
  signal,
  reused,
  rubric,
  trials,
  jobs,
}) {
  let results = [...reused]
  let initialExecution = {
    planned: trials.length,
    reused: reused.length,
    queued: trials.length,
    stopReason: null,
    finished: 0,
    started: 0,
    running: 0,
    skipped: 0,
    jobs,
  }
  await saveJson(path.join(outputDirectory, 'summary.json'), {
    variants: summarize(results, { planned }),
    execution: initialExecution,
  })
  let modelCalls = trials.reduce(
    (total, trial) =>
      total + (trial.previous?.regrade ? 0 : 1) + (settings.grade ? 1 : 0),
    0,
  )
  console.info(
    `Planning ${modelCalls} model calls with ${jobs} jobs. Results: ${outputDirectory}`,
  )
  let queue = await runTrialQueue({
    async onResult(trial, result, execution) {
      let record = { ...trialMetadata(trial), ...result }
      results.push(record)
      let runDirectory = trialDirectory(outputDirectory, trial)
      await mkdir(runDirectory, { recursive: true })
      await saveJson(path.join(runDirectory, 'result.json'), record)
      await saveJson(path.join(outputDirectory, 'summary.json'), {
        execution: { ...execution, reused: reused.length },
        variants: summarize(results, { planned }),
      })
      let outcome = 'ungraded'
      if (record.grade) {
        outcome = `grade: ${record.grade.pass}`
      }
      if (record.trigger) {
        outcome = `trigger: ${record.trigger.pass}`
      }
      console.info(
        [
          record.caseId,
          record.variant,
          record.repeat,
          record.status,
          record.error ?? outcome,
        ].join(' | '),
      )
    },
    runTrial: (trial, trialSignal) =>
      executeTrial(trial, {
        signal: trialSignal,
        disabledSkillPaths,
        outputDirectory,
        suiteFile,
        snapshots,
        settings,
        rubric,
      }),
    signal,
    trials,
    jobs,
  })
  await saveJson(
    path.join(outputDirectory, 'skipped.json'),
    queue.skipped.map(trial => ({
      ...trialMetadata(trial),
      reason: queue.execution.stopReason,
    })),
  )
  await saveJson(path.join(outputDirectory, 'summary.json'), {
    execution: { ...queue.execution, reused: reused.length },
    variants: summarize(results, { planned }),
  })
  if (queue.persistenceErrors.length > 0) {
    throw new Error(queue.persistenceErrors.map(item => item.error).join('; '))
  }
  if (
    queue.execution.stopReason ||
    results.some(
      result =>
        result.grade?.pass === false ||
        (result.trigger && result.trigger.pass !== true),
    )
  ) {
    return 1
  }
  return 0
}

async function gradeResult(
  writerResult,
  item,
  {
    disabledSkillPaths,
    outputDirectory,
    failedAttempts,
    runDirectory,
    suiteFile,
    settings,
    rubric,
    signal,
  },
) {
  let result = writerResult
  let workspace
  try {
    signal.throwIfAborted()
    workspace = await mkdtemp(path.join(tmpdir(), 'ghostwriter-grade-'))
    await copyInputs(item, suiteFile, workspace)
    let schemaPath = path.join(workspace, 'schema.json')
    await saveJson(schemaPath, gradingSchema(item.expectations.length))
    let prompt = gradingPrompt(item, result, rubric)
    let gradingDirectory = path.join(runDirectory, 'grading')
    let attempt = await withRetries(
      async () => {
        await mkdir(gradingDirectory, { recursive: true })
        await writeFile(path.join(gradingDirectory, 'prompt.txt'), prompt)
        signal.throwIfAborted()
        let run = await runCodex({
          reasoningEffort: settings.graderEffort,
          outputDirectory: gradingDirectory,
          timeoutMs: settings.timeoutMs,
          model: settings.graderModel,
          disabledSkillPaths,
          cwd: workspace,
          schemaPath,
          prompt,
          signal,
        })
        if (run.status !== 'completed') {
          return { retryable: true, run }
        }
        try {
          let grade = parseGrade(run.response, item.expectations.length)
          return { run: { ...run, grade }, retryable: false }
        } catch (error) {
          return { run: { ...run, error: error.message }, retryable: true }
        }
      },
      {
        directory: gradingDirectory,
        retries: settings.retries,
        phase: 'grader',
        outputDirectory,
        failedAttempts,
        signal,
      },
    )
    result.gradingRun = {
      durationMs: attempt.durationMs,
      status: attempt.status,
      usage: attempt.usage,
      error: attempt.error,
    }
    if (attempt.grade) {
      result.grade = attempt.grade
      await saveJson(path.join(gradingDirectory, 'grade.json'), result.grade)
    } else {
      result = { ...result, status: 'grading_failed', error: attempt.error }
    }
  } catch (error) {
    result = { ...result, status: 'grading_failed', error: error.message }
  } finally {
    if (workspace) {
      try {
        await rm(workspace, { recursive: true, force: true })
      } catch (error) {
        result = {
          ...result,
          error: `Grader workspace cleanup failed: ${error.message}`,
          cleanupError: error.message,
          status: 'cleanup_failed',
        }
      }
    }
  }
  return result
}

async function executeTrial(trial, options) {
  let {
    disabledSkillPaths,
    outputDirectory,
    suiteFile,
    snapshots,
    settings,
    rubric,
    signal,
  } = options
  let { previous, item } = trial
  let runDirectory = trialDirectory(outputDirectory, trial)
  let failedAttempts = [...(previous?.record?.failedAttempts ?? [])]
  let context = {
    disabledSkillPaths,
    outputDirectory,
    failedAttempts,
    runDirectory,
    suiteFile,
    snapshots,
    settings,
    rubric,
    signal,
  }
  let result = { ...trialMetadata(trial), failedAttempts }
  let workspace
  try {
    signal.throwIfAborted()
    if (previous?.regrade) {
      failedAttempts.push({
        artifacts: await setAside(
          path.join(runDirectory, 'grading'),
          outputDirectory,
        ),
        status: previous.record.gradingRun?.status ?? 'failed',
        error: previous.record.error,
        phase: 'grader',
      })
      // Grade the saved writer response again instead of repeating the writer call.
      result = await gradeResult(
        {
          ...previous.record,
          status: previous.record.writerStatus,
          gradingRun: undefined,
          grade: undefined,
          failedAttempts,
          error: null,
        },
        item,
        context,
      )
    } else {
      if (previous) {
        failedAttempts.push({
          artifacts: await setAside(runDirectory, outputDirectory),
          status: previous.record?.status ?? 'incomplete',
          error: previous.record?.error ?? null,
          phase: 'trial',
        })
      }
      workspace = await mkdtemp(path.join(tmpdir(), 'ghostwriter-eval-'))
      result = await writeAndGrade(result, trial, { ...context, workspace })
    }
    if (signal.aborted && result.status !== 'completed') {
      result.status = 'aborted'
    }
  } catch (error) {
    result = {
      ...result,
      status: signal.aborted ? 'aborted' : 'failed',
      error: error.message,
    }
  } finally {
    if (workspace) {
      try {
        await rm(workspace, { recursive: true, force: true })
      } catch (error) {
        result = {
          ...result,
          error: `Workspace cleanup failed: ${error.message}`,
          cleanupError: error.message,
          status: 'cleanup_failed',
        }
      }
    }
  }
  return result
}

async function writeAndGrade(metadata, { variant, item }, context) {
  let {
    disabledSkillPaths,
    outputDirectory,
    failedAttempts,
    runDirectory,
    suiteFile,
    snapshots,
    workspace,
    settings,
    signal,
  } = context
  await copyInputs(item, suiteFile, workspace)
  let snapshot = snapshots[variant]
  let skill = snapshot ? 'skill/ghostwriter' : undefined
  if (snapshot) {
    await cp(snapshot.path, path.join(workspace, skill), { recursive: true })
  }
  let prompt = taskPrompt(item, {
    metadata: snapshot?.metadata,
    kind: settings.suite,
    skill,
  })
  let writer = await withRetries(
    async () => {
      await mkdir(runDirectory, { recursive: true })
      await writeFile(path.join(runDirectory, 'prompt.txt'), prompt)
      signal.throwIfAborted()
      let run = await runCodex({
        reasoningEffort: settings.effort,
        timeoutMs: settings.timeoutMs,
        outputDirectory: runDirectory,
        model: settings.model,
        disabledSkillPaths,
        cwd: workspace,
        prompt,
        signal,
      })
      return { retryable: run.status !== 'completed', run }
    },
    {
      retries: settings.retries,
      directory: runDirectory,
      outputDirectory,
      phase: 'writer',
      failedAttempts,
      signal,
    },
  )
  let result = { ...metadata, ...writer, writerStatus: writer.status }
  if (result.status === 'completed' && settings.suite === 'triggers') {
    let observation = observeSkillRead(result.commands, snapshot.metadata)
    result.trigger = {
      ...observation,
      pass:
        observation.observed === null ?
          null
        : observation.observed === item.should_trigger,
      expected: item.should_trigger,
    }
  }
  if (result.status === 'completed' && settings.grade) {
    // GradeResult handles an abort itself, so the writer's response is kept.
    result = await gradeResult(result, item, context)
  }
  return result
}

async function readSnapshot(directory, label = directory) {
  let content = await readFile(path.join(directory, 'SKILL.md'), 'utf8')
  let frontmatter = /^---\r?\n(?<yaml>[\s\S]*?)\r?\n---(?:\r?\n|$)/u.exec(
    content,
  )
  if (!frontmatter) {
    throw new Error(`Snapshot lacks frontmatter: ${label}`)
  }
  let document = parseDocument(frontmatter.groups.yaml)
  if (document.errors.length > 0) {
    throw new Error(`Invalid snapshot frontmatter: ${label}`)
  }
  let metadata = document.toJS()
  if (
    typeof metadata.name !== 'string' ||
    typeof metadata.description !== 'string'
  ) {
    throw new TypeError('Snapshot needs name and description')
  }
  metadata.firstHeading = /^# .+$/mu.exec(content)?.[0]
  if (!metadata.firstHeading) {
    throw new Error(
      'Snapshot needs a top-level heading for observed-read checks',
    )
  }
  return { sha256: await fingerprint(directory), path: directory, metadata }
}

// Moves a failed attempt to the first free `NAME.failed-N` beside it.
async function setAside(directory, outputDirectory) {
  let parent = path.dirname(directory)
  let prefix = `${path.basename(directory)}.failed-`
  let numbers = (await readdir(parent))
    .filter(name => name.startsWith(prefix))
    .map(name => Number(name.slice(prefix.length)))
    .filter(Number.isSafeInteger)
  let target = path.join(parent, `${prefix}${Math.max(0, ...numbers) + 1}`)
  try {
    await rename(directory, target)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null
    }
    throw error
  }
  return path.relative(outputDirectory, target)
}

async function withRetries(attempt, options) {
  let { outputDirectory, failedAttempts, directory, retries, signal, phase } =
    options
  let { retryable, run } = await attempt()
  if (!retryable || retries < 1 || signal.aborted) {
    return run
  }
  failedAttempts.push({
    artifacts: await setAside(directory, outputDirectory),
    durationMs: run.durationMs,
    status: run.status,
    error: run.error,
    usage: run.usage,
    phase,
  })
  return await withRetries(attempt, { ...options, retries: retries - 1 })
}

async function previousState(outputDirectory, trial) {
  let runDirectory = trialDirectory(outputDirectory, trial)
  try {
    await lstat(runDirectory)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { exists: false, record: null }
    }
    throw error
  }
  try {
    return {
      record: await readJson(path.join(runDirectory, 'result.json')),
      exists: true,
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return { exists: true, record: null }
    }
    throw error
  }
}

function plannedMetrics(cases, variants, runs) {
  return Object.fromEntries(
    variants.map(variant => [
      variant,
      {
        expectations:
          cases.reduce(
            (total, item) => total + (item.expectations?.length ?? 0),
            0,
          ) * runs,
        runs: cases.length * runs,
      },
    ]),
  )
}

async function copyInputs(item, suiteFile, workspace) {
  await Promise.all(
    (item.files ?? []).map(async file => {
      let source = await fixturePath(path.dirname(suiteFile), file)
      let target = path.join(workspace, file)
      await mkdir(path.dirname(target), { recursive: true })
      await cp(source, target)
    }),
  )
}

function planTrials(cases, variants, runs) {
  let trials = []
  for (let item of cases) {
    for (let repeat = 1; repeat <= runs; repeat++) {
      let order = repeat % 2 ? variants : variants.toReversed()
      for (let variant of order) {
        trials.push({ variant, repeat, item })
      }
    }
  }
  return trials
}

async function resolveNewPath(filename) {
  try {
    return await realpath(filename)
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
    return path.join(
      await resolveNewPath(path.dirname(filename)),
      path.basename(filename),
    )
  }
}

function trialMetadata({ variant, repeat, item }) {
  return {
    expectationCount: item.expectations?.length ?? 0,
    caseName: item.name,
    caseId: item.id,
    variant,
    repeat,
  }
}

async function saveJson(filename, data) {
  let temporary = `${filename}.tmp`
  await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`)
  await rename(temporary, filename)
}

async function hashFile(filename) {
  let { createHash } = await import('node:crypto')
  return createHash('sha256')
    .update(await readFile(filename))
    .digest('hex')
}

function suitePath(root, suite) {
  return path.join(
    root,
    'test/fixtures',
    suite === 'triggers' ? 'triggers.json' : 'regression-tasks.json',
  )
}

function trialDirectory(outputDirectory, { variant, repeat, item }) {
  return path.join(outputDirectory, `case-${item.id}`, variant, `run-${repeat}`)
}

function snapshotDirectory(outputDirectory, variant) {
  return path.join(outputDirectory, 'snapshots', variant, 'ghostwriter')
}

function trialKey({ variant, repeat, caseId }) {
  return `${String(caseId)}/${variant}/${repeat}`
}

async function readJson(filename) {
  return JSON.parse(await readFile(filename, 'utf8'))
}
