import {
  writeFile,
  realpath,
  readdir,
  mkdtemp,
  symlink,
  mkdir,
  rm,
} from 'node:fs/promises'
import { onTestFinished, describe, expect, it, vi } from 'vitest'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { createServer } from 'node:net'
import { once } from 'node:events'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import {
  observeSkillRead,
  gradingPrompt,
  gradingSchema,
  fixturePath,
  fingerprint,
  selectCases,
  parseGrade,
  taskPrompt,
  readSuite,
  summarize,
} from '../scripts/lib/evaluation.js'

vi.mock(import('node:fs/promises'), async importOriginal => {
  let actual = await importOriginal()
  return { ...actual, readdir: vi.fn(actual.readdir) }
})

function validGrade() {
  function assessment() {
    return { evidence: 'The wording is clear.', score: 2 }
  }
  return {
    expectations: [
      { evidence: 'The source fact remains.', pass: true, index: 0 },
      { evidence: 'The requested scope remains.', pass: true, index: 1 },
    ],
    readability: {
      clarity: assessment(),
      economy: assessment(),
      order: assessment(),
      voice: assessment(),
    },
    factualIntegrity: { evidence: 'No facts changed.', pass: true },
    scope: { evidence: 'Only the note was edited.', pass: true },
  }
}

async function snapshot(files) {
  let directory = await mkdtemp(join(tmpdir(), 'evaluation-snapshot-'))
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  await Promise.all(
    Object.entries(files).map(async ([name, content]) => {
      let filename = join(directory, name)
      await mkdir(join(filename, '..'), { recursive: true })
      await writeFile(filename, content)
    }),
  )
  return directory
}

function regressionCase(overrides = {}) {
  return {
    ...suiteField('expected_output', 'PRIVATE EXPECTED OUTCOME'),
    expectations: ['PRIVATE EXPECTATION ONE', 'PRIVATE EXPECTATION TWO'],
    prompt: 'Edit this note: The import finishes at noon.',
    name: 'plain-note',
    files: [],
    id: 1,
    ...overrides,
  }
}

async function fixture() {
  let directory = await mkdtemp(join(tmpdir(), 'evaluation-test-'))
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  let base = join(directory, 'fixtures')
  await mkdir(join(base, 'inputs'), { recursive: true })
  return { directory, base }
}

function expectedFingerprint(records) {
  let hash = createHash('sha256')
  for (let [name, content] of records) {
    hash.update(name)
    hash.update('\0')
    hash.update(content)
    hash.update('\0')
  }
  return hash.digest('hex')
}

async function listenOnSocket(filename) {
  let server = createServer()
  server.listen(filename)
  await once(server, 'listening')
  onTestFinished(async () => {
    server.close()
    await once(server, 'close')
  })
}

async function suiteFile(data) {
  let { base } = await fixture()
  let filename = join(base, 'suite.json')
  await writeFile(filename, JSON.stringify(data))
  return filename
}

function checkTarget(grade, check) {
  if (check === 'expectation') {
    return grade.expectations[0]
  }
  return grade[check]
}

function regressionSuite(cases) {
  // cspell:disable-next-line
  return { evals: cases }
}

// Suite files keep the skill-creator field names, which are snake_case.
function suiteField(name, value) {
  return Object.fromEntries([[name, value]])
}

describe('evaluation', () => {
  it('task prompts exclude reference outcomes and expectations in every variant', () => {
    let item = regressionCase({ files: ['inputs/notes/source.md'] })
    for (let skill of [undefined, 'skill/ghostwriter']) {
      let prompt = taskPrompt(item, { skill })
      expect(prompt).toContain(item.prompt)
      expect(prompt).toContain('inputs/notes/source.md')
      expect(prompt).not.toContain(item.expected_output)
      for (let expectation of item.expectations) {
        expect(prompt).not.toContain(expectation)
      }
    }
  })

  it('trigger labels do not change the writer prompt', () => {
    let item = regressionCase()
    let options = {
      metadata: { description: 'Edits technical prose.', name: 'ghostwriter' },
      skill: 'skill/ghostwriter',
      kind: 'triggers',
    }
    let positive = taskPrompt(
      { ...item, ...suiteField('should_trigger', true) },
      options,
    )
    let negative = taskPrompt(
      { ...item, ...suiteField('should_trigger', false) },
      options,
    )
    expect(positive).toBe(negative)
    expect(positive).not.toContain(item.expected_output)
    expect(positive).not.toContain(item.expectations[0])
    expect(positive).not.toContain('should_trigger')
    expect(positive).toContain(options.metadata.description)
  })

  it('grading receives references but no variant identity', () => {
    let item = regressionCase({
      settings: { effort: 'PRIVATE EFFORT SETTING' },
      variant: 'PRIVATE VARIANT IDENTITY',
      skillBody: 'PRIVATE SKILL BODY',
      model: 'PRIVATE MODEL SETTING',
    })
    let prompt = gradingPrompt(
      item,
      { response: 'The import finishes at noon.' },
      'RUBRIC',
    )
    expect(prompt).toContain(item.expected_output)
    for (let expectation of item.expectations) {
      expect(prompt).toContain(expectation)
    }
    expect(prompt).toContain(item.prompt)
    expect(prompt).toContain('RUBRIC')
    expect(prompt).not.toContain(item.variant)
    expect(prompt).not.toContain(item.model)
    expect(prompt).not.toContain(item.settings.effort)
    expect(prompt).not.toContain(item.skillBody)
  })

  it('grading sees the writer commands except skill reads, so variants look alike', () => {
    let item = regressionCase()
    let run = {
      command: "/bin/zsh -lc 'node --test test/notes.test.js'",
      exitCode: 1,
    }
    let skillReads = [
      { command: "/bin/zsh -lc 'cat skill/ghostwriter/SKILL.md'", exitCode: 0 },
      {
        command: 'sed -n 1,40p skill/ghostwriter/rules/filler.md',
        exitCode: 0,
      },
    ]
    let withSkill = gradingPrompt(
      item,
      { commands: [...skillReads, run], response: 'Answer.' },
      'RUBRIC',
    )
    let withoutSkill = gradingPrompt(
      item,
      { response: 'Answer.', commands: [run] },
      'RUBRIC',
    )
    expect(withSkill).toBe(withoutSkill)
    expect(withSkill).toContain('- exit 1: node --test test/notes.test.js')
    expect(withSkill).not.toContain('SKILL.md')
    expect(
      gradingPrompt(
        item,
        { commands: skillReads, response: 'Answer.' },
        'RUBRIC',
      ),
    ).toContain('(none)')
  })

  it('reads the complete regression and trigger fixtures offline', async () => {
    let regression = await readSuite(
      fileURLToPath(
        new URL('./fixtures/regression-tasks.json', import.meta.url),
      ),
    )
    let triggers = await readSuite(
      fileURLToPath(new URL('./fixtures/triggers.json', import.meta.url)),
      'triggers',
    )
    expect(regression).toHaveLength(40)
    expect(selectCases(regression)).toHaveLength(36)
    expect(selectCases(regression, undefined, 'holdout')).toHaveLength(4)
    expect(triggers).toHaveLength(20)
    expect(triggers.filter(item => item.should_trigger)).toHaveLength(10)
  })

  it('rejects duplicate IDs including numeric and string equivalents', async () => {
    let filename = await suiteFile(
      regressionSuite([
        regressionCase(),
        regressionCase({ name: 'other-note', id: '1' }),
      ]),
    )
    await expect(readSuite(filename)).rejects.toThrow(/duplicate case id/u)
  })

  it('rejects duplicate case names', async () => {
    let filename = await suiteFile(
      regressionSuite([regressionCase(), regressionCase({ id: 2 })]),
    )
    await expect(readSuite(filename)).rejects.toThrow(/duplicate case name/u)
  })

  it('case IDs accept strings and integers but reject coerced values', async () => {
    await Promise.all(
      [true, false, [1], null, 1.5].map(async id => {
        let filename = await suiteFile(
          regressionSuite([regressionCase({ id })]),
        )
        await expect(readSuite(filename)).rejects.toThrow(/case id/u)
      }),
    )
    await Promise.all(
      [12, 'text-id'].map(async id => {
        let filename = await suiteFile(
          regressionSuite([regressionCase({ id })]),
        )
        expect((await readSuite(filename))[0].id).toBe(id)
      }),
    )
  })

  it('rejects case names that only become valid after string conversion', async () => {
    await Promise.all(
      [123, true, ['plain-note']].map(async name => {
        let filename = await suiteFile(
          regressionSuite([regressionCase({ name })]),
        )
        await expect(readSuite(filename)).rejects.toThrow(/case name/u)
      }),
    )
  })

  it('rejects absent trigger labels and values other than booleans', async () => {
    await Promise.all(
      [undefined, null, 0, 1, 'false', 'true'].map(async label => {
        let filename = await suiteFile({
          queries: [
            {
              ...suiteField('should_trigger', label),
              prompt: 'Edit this note.',
              id: 1,
            },
          ],
        })
        await expect(readSuite(filename, 'triggers')).rejects.toThrow(
          /boolean/u,
        )
      }),
    )
  })

  it('rejects empty suites, empty prompts, and empty expectations', async () => {
    let cases = [
      regressionSuite([]),
      regressionSuite([regressionCase({ prompt: ' ' })]),
      regressionSuite([regressionCase({ expectations: [] })]),
      regressionSuite([regressionCase({ expectations: [' '] })]),
    ]
    await Promise.all(
      cases.map(async data => {
        let filename = await suiteFile(data)
        await expect(readSuite(filename)).rejects.toThrow()
      }),
    )
  })

  it('accepts nested fixture files inside the fixture directory', async () => {
    let { base } = await fixture()
    await mkdir(join(base, 'inputs/notes'))
    let filename = join(base, 'inputs/notes/source.md')
    await writeFile(filename, '# Source\n')
    await expect(fixturePath(base, 'inputs/notes/source.md')).resolves.toBe(
      await realpath(filename),
    )
  })

  it('rejects absolute paths and traversal before reading a fixture', async () => {
    let { directory, base } = await fixture()
    let outside = join(directory, 'outside.md')
    await writeFile(outside, 'Private source\n')
    let paths = [
      outside,
      '../outside.md',
      'notes/../../outside.md',
      String.raw`..\outside.md`,
    ]
    await Promise.all(
      paths.map(async filename => {
        await expect(fixturePath(base, filename)).rejects.toThrow(
          /relative.*inside/u,
        )
      }),
    )
  })

  it('rejects fixture symlinks to an outside file or directory', async () => {
    let { directory, base } = await fixture()
    let outside = join(directory, 'outside')
    await mkdir(outside)
    await writeFile(join(outside, 'source.md'), 'Private source\n')
    await symlink(join(outside, 'source.md'), join(base, 'inputs/linked.md'))
    await symlink(outside, join(base, 'inputs/linked-directory'))
    await expect(fixturePath(base, 'inputs/linked.md')).rejects.toThrow(
      /outside/u,
    )
    await expect(
      fixturePath(base, 'inputs/linked-directory/source.md'),
    ).rejects.toThrow(/outside/u)
  })

  it('suite validation rejects unsafe fixture references before a run', async () => {
    let { directory, base } = await fixture()
    let outside = join(directory, 'outside.md')
    await writeFile(outside, 'Private source\n')
    await symlink(outside, join(base, 'inputs/linked.md'))
    await Promise.all(
      ['../outside.md', outside, 'inputs/linked.md'].map(
        async (file, index) => {
          let filename = join(base, `suite-${index}.json`)
          await writeFile(
            filename,
            JSON.stringify(
              regressionSuite([regressionCase({ files: [file] })]),
            ),
          )
          await expect(readSuite(filename)).rejects.toThrow(/inside|outside/u)
        },
      ),
    )
  })

  it('suite answers and reserved workspace paths cannot become writer inputs', async () => {
    let { base } = await fixture()
    let suite = join(base, 'regression-tasks.json')
    await writeFile(suite, JSON.stringify(regressionSuite([regressionCase()])))
    await symlink(suite, join(base, 'inputs/answers.json'))
    await Promise.all(
      [
        'regression-tasks.json',
        'schema.json',
        'skill/SKILL.md',
        'inputs/answers.json',
      ].map(async file => {
        await expect(fixturePath(base, file)).rejects.toThrow(/inside|outside/u)
      }),
    )
    await writeFile(
      suite,
      JSON.stringify(
        regressionSuite([regressionCase({ files: ['regression-tasks.json'] })]),
      ),
    )
    await expect(readSuite(suite)).rejects.toThrow(/inside inputs/u)
  })

  it('fingerprints reject a symlink as the snapshot root', async () => {
    let { directory, base } = await fixture()
    await writeFile(join(base, 'SKILL.md'), '# Example\n')
    let link = join(directory, 'linked-skill')
    await symlink(base, link)
    await expect(fingerprint(base)).resolves.toMatch(/^[0-9a-f]{64}$/u)
    await expect(fingerprint(link)).rejects.toThrow(/root.*symlink/u)
  })

  it('selection accepts IDs and names only within the selected split', () => {
    let cases = [
      regressionCase({ split: 'dev' }),
      regressionCase({ name: 'second-note', split: 'dev', id: 2 }),
      regressionCase({ name: 'fresh-note', split: 'holdout', id: 3 }),
    ]
    expect(selectCases(cases, '1,second-note')).toStrictEqual(cases.slice(0, 2))
    expect(selectCases(cases, 'fresh-note', 'holdout')).toStrictEqual([
      cases[2],
    ])
    expect(() => selectCases(cases, 'fresh-note')).toThrow(/Unknown case/u)
    expect(() => selectCases(cases, '1,missing')).toThrow(/Unknown case/u)
    expect(() => selectCases(cases, '1,')).toThrow(/Unknown case/u)
  })

  it('selection never silently returns an empty suite', () => {
    expect(() => selectCases([])).toThrow(/No cases/u)
    expect(() => selectCases([regressionCase()], undefined, 'holdout')).toThrow(
      /No cases/u,
    )
  })

  it('grade schema covers each expectation and the rubric dimensions', () => {
    let schema = gradingSchema(2)
    expect(schema.properties.expectations.minItems).toBe(2)
    expect(schema.properties.expectations.maxItems).toBe(2)
    for (let dimension of ['clarity', 'order', 'economy', 'voice']) {
      let { score } =
        schema.properties.readability.properties[dimension].properties
      expect(score.minimum).toBe(0)
      expect(score.maximum).toBe(2)
    }
  })

  it('accepts a complete evidence-backed grade', () => {
    expect(parseGrade(JSON.stringify(validGrade()), 2).pass).toBe(true)
  })

  it('rejects an omitted expectation', () => {
    let grade = validGrade()
    grade.expectations.pop()
    expect(() => parseGrade(JSON.stringify(grade), 2)).toThrow(
      /every expectation/u,
    )
  })

  it('rejects duplicate indexes and indexes outside the integer range', () => {
    for (let index of [0, 2, -1, 0.5, '1']) {
      let grade = validGrade()
      grade.expectations[1].index = index
      expect(() => parseGrade(JSON.stringify(grade), 2)).toThrow(/indexes/u)
    }
  })

  it('rejects empty evidence for expectations and required checks', () => {
    for (let check of ['expectation', 'factualIntegrity', 'scope']) {
      let grade = validGrade()
      let target = checkTarget(grade, check)
      target.evidence = ' \n '
      expect(() => parseGrade(JSON.stringify(grade), 2)).toThrow(/evidence/u)
    }
  })

  it('rejects missing factual and scope checks', () => {
    for (let check of ['factualIntegrity', 'scope']) {
      let grade = validGrade()
      delete grade[check]
      expect(() => parseGrade(JSON.stringify(grade), 2)).toThrow()
    }
  })

  it('rejects verdicts other than booleans or an explicit not-assessed null', () => {
    for (let value of ['false', 'true', 0, 1, undefined]) {
      let grade = validGrade()
      grade.expectations[0].pass = value
      expect(() => parseGrade(JSON.stringify(grade), 2)).toThrow()
    }
  })

  it('requires evidence and a valid score for every readability dimension', () => {
    for (let dimension of ['clarity', 'order', 'economy', 'voice']) {
      for (let invalid of [
        { evidence: ' ', score: 2 },
        { evidence: 'Evidence', score: -1 },
        { evidence: 'Evidence', score: 3 },
        { evidence: 'Evidence', score: 1.5 },
        { evidence: 'Evidence', score: '2' },
      ]) {
        let grade = validGrade()
        grade.readability[dimension] = invalid
        expect(() => parseGrade(JSON.stringify(grade), 2)).toThrow()
      }
      let grade = validGrade()
      delete grade.readability[dimension]
      expect(() => parseGrade(JSON.stringify(grade), 2)).toThrow()
    }
  })

  it('high style scores cannot compensate for failed facts or scope', () => {
    for (let check of ['factualIntegrity', 'scope']) {
      let grade = validGrade()
      grade[check].pass = false
      grade.pass = true
      expect(parseGrade(JSON.stringify(grade), 2).pass).toBe(false)
    }
    let grade = validGrade()
    grade.expectations[1].pass = false
    expect(parseGrade(JSON.stringify(grade), 2).pass).toBe(false)
  })

  it('a check not assessed never becomes a passing grade', () => {
    for (let check of ['expectation', 'factualIntegrity', 'scope']) {
      let grade = validGrade()
      let target = checkTarget(grade, check)
      target.pass = null
      target.evidence = 'The required source is missing.'
      expect(parseGrade(JSON.stringify(grade), 2).pass).toBe(false)
    }
  })

  it('ungraded runs have no pass rate and unknown token counts stay unknown', () => {
    let result = summarize([
      { status: 'completed', variant: 'current' },
    ]).current
    expect(result.completed).toBe(1)
    expect(result.graded).toBe(0)
    expect(result.passed).toBe(0)
    expect(result.passRate).toBeNull()
    expect(result.inputTokens).toStrictEqual({ samples: 0, mean: null })
    expect(result.outputTokens).toStrictEqual({ samples: 0, mean: null })
  })

  it('reported zero token use is distinct from an absent measurement', () => {
    let result = summarize([
      {
        usage: JSON.parse('{"input_tokens":0,"output_tokens":0}'),
        status: 'completed',
        variant: 'none',
      },
      { status: 'completed', variant: 'none', usage: {} },
    ]).none
    expect(result.inputTokens).toStrictEqual({ samples: 1, mean: 0 })
    expect(result.outputTokens).toStrictEqual({ samples: 1, mean: 0 })
  })

  it('failed runs cannot pass through a leftover grade or trigger verdict', () => {
    for (let status of ['failed', 'grading_failed']) {
      for (let verdict of [
        { grade: { pass: true } },
        { trigger: { pass: true } },
      ]) {
        let result = summarize([
          { variant: 'current', status, ...verdict },
        ]).current
        expect(result.passed).toBe(0)
        expect(result.failed).toBe(1)
        expect(result.passRate).not.toBe(1)
      }
    }
  })

  it('a failed run with a failed verdict is not counted twice', () => {
    let result = summarize([
      { grade: { pass: false }, variant: 'current', status: 'failed' },
    ]).current
    expect(result.failed).toBe(1)
    expect(result.passed).toBe(0)
  })

  it('unknown trigger observations never count as a pass', () => {
    let result = summarize([
      {
        trigger: { observed: null, pass: null },
        status: 'completed',
        variant: 'current',
      },
    ]).current
    expect(result.passed).toBe(0)
    expect(result.failed).toBe(1)
    expect(result.passRate).toBe(0)
  })

  it('expectation rates distinguish thirteen of fourteen from zero despite both strict failures', () => {
    function result(passed, variant) {
      let grade = validGrade()
      grade.expectations = Array.from({ length: 14 }, (_, index) => ({
        evidence: 'Compared with the source.',
        pass: index < passed,
        index,
      }))
      return {
        grade: parseGrade(JSON.stringify(grade), 14),
        expectationCount: 14,
        status: 'completed',
        variant,
      }
    }
    let summary = summarize([result(13, 'current'), result(0, 'none')])
    expect(summary.current.passRate).toBe(0)
    expect(summary.none.passRate).toBe(0)
    expect(summary.current.expectations.passed).toBe(13)
    expect(summary.current.expectations.failed).toBe(1)
    expect(summary.current.expectations.passRate).toBe(13 / 14)
    expect(summary.none.expectations.passRate).toBe(0)
    expect(summary.current.readability.clarity).toStrictEqual({
      samples: 1,
      mean: 2,
    })
  })

  it('facts and scope remain separate from expectations and readable wording', () => {
    let grade = validGrade()
    grade.factualIntegrity.pass = false
    let result = summarize([
      {
        grade: parseGrade(JSON.stringify(grade), 2),
        expectationCount: 2,
        status: 'completed',
        variant: 'current',
      },
    ]).current
    expect(result.expectations.passRate).toBe(1)
    expect(result.factualIntegrity.failed).toBe(1)
    expect(result.scope.passed).toBe(1)
    expect(result.qualityFailed).toBe(1)
    expect(result.passed).toBe(0)
    for (let dimension of ['clarity', 'order', 'economy', 'voice']) {
      expect(result.readability[dimension]).toStrictEqual({
        samples: 1,
        mean: 2,
      })
    }
  })

  it('explicit null assessments are counted without becoming passes or missing grades', () => {
    let grade = validGrade()
    grade.expectations[1].pass = null
    grade.factualIntegrity.pass = null
    let result = summarize([
      {
        grade: parseGrade(JSON.stringify(grade), 2),
        expectationCount: 2,
        status: 'completed',
        variant: 'current',
      },
    ]).current
    expect(result.expectations.notAssessed).toBe(1)
    expect(result.expectations.missing).toBe(0)
    expect(result.expectations.passRate).toBe(0.5)
    expect(result.factualIntegrity.notAssessed).toBe(1)
    expect(result.factualIntegrity.missing).toBe(0)
    expect(result.qualityFailed).toBe(0)
    expect(result.passed).toBe(0)
  })

  it('infrastructure errors and absent grades do not become quality failures', () => {
    let grade = parseGrade(JSON.stringify(validGrade()), 2)
    let result = summarize(
      [
        { status: 'completed', grade },
        { status: 'completed' },
        { status: 'failed', grade },
        { status: 'grading_failed', grade },
      ].map(run => ({ expectationCount: 2, variant: 'current', ...run })),
    ).current
    expect(result.availableGrades).toBe(1)
    expect(result.ungraded).toBe(1)
    expect(result.infrastructureErrors).toBe(1)
    expect(result.gradingErrors).toBe(1)
    expect(result.qualityFailed).toBe(0)
    expect(result.expectations.total).toBe(8)
    expect(result.expectations.passed).toBe(2)
    expect(result.expectations.failed).toBe(0)
    expect(result.expectations.missing).toBe(6)
    expect(result.expectations.passRate).toBe(0.25)
    expect(result.expectations.availablePassRate).toBe(1)
    expect(result.expectations.coverage).toBe(0.25)
    expect(result.factualIntegrity.passed).toBe(1)
    expect(result.factualIntegrity.missing).toBe(3)
    expect(result.readability.clarity).toStrictEqual({ samples: 1, mean: 2 })
  })

  it('a validated grade survives cleanup failure while strict run success still fails', () => {
    let result = summarize([
      {
        grade: parseGrade(JSON.stringify(validGrade()), 2),
        gradingRun: { status: 'completed' },
        writerStatus: 'completed',
        status: 'cleanup_failed',
        expectationCount: 2,
        variant: 'current',
      },
    ]).current
    expect(result.passed).toBe(0)
    expect(result.failed).toBe(1)
    expect(result.infrastructureErrors).toBe(1)
    expect(result.completed).toBe(0)
    expect(result.availableGrades).toBe(1)
    expect(result.expectations.passed).toBe(2)
    expect(result.expectations.missing).toBe(0)
    expect(result.factualIntegrity.passed).toBe(1)
    expect(result.scope.passed).toBe(1)
    expect(result.readability.clarity).toStrictEqual({ samples: 1, mean: 2 })
  })

  it('cleanup failures trust no grade without both completion records and valid content', () => {
    let complete = {
      grade: parseGrade(JSON.stringify(validGrade()), 2),
      gradingRun: { status: 'completed' },
      writerStatus: 'completed',
      status: 'cleanup_failed',
      expectationCount: 2,
      variant: 'current',
    }
    let invalid = validGrade()
    invalid.expectations[0].evidence = ''
    for (let change of [
      { writerStatus: undefined },
      { writerStatus: 'failed' },
      { gradingRun: undefined },
      { gradingRun: { status: 'failed' } },
      { grade: undefined },
      { grade: invalid },
      { expectationCount: 3 },
    ]) {
      let result = summarize([{ ...complete, ...change }]).current
      expect(result.availableGrades).toBe(0)
      expect(result.expectations.passed).toBe(0)
      expect(result.factualIntegrity.passed).toBe(0)
      expect(result.readability.clarity).toStrictEqual({
        samples: 0,
        mean: null,
      })
    }
  })

  it('planned but unfinished runs remain in quality denominators', () => {
    let result = summarize(
      [
        {
          grade: parseGrade(JSON.stringify(validGrade()), 2),
          expectationCount: 2,
          status: 'completed',
          variant: 'current',
        },
      ],
      { planned: { current: { expectations: 6, runs: 3 } } },
    ).current
    expect(result.selected).toBe(3)
    expect(result.total).toBe(1)
    expect(result.expectations.total).toBe(6)
    expect(result.expectations.missing).toBe(4)
    expect(result.expectations.passRate).toBe(1 / 3)
    expect(result.factualIntegrity.total).toBe(3)
    expect(result.scope.missing).toBe(2)
    let pending = summarize([], {
      planned: { current: { expectations: 6, runs: 3 } },
    }).current
    expect(pending.expectations.missing).toBe(6)
    expect(pending.expectations.passRate).toBeNull()
    expect(pending.scope.missing).toBe(3)
  })

  it('missing expectation counts and unavailable grades are explicit rather than zero quality', () => {
    let grade = parseGrade(JSON.stringify(validGrade()), 2)
    let partial = summarize([
      { status: 'completed', variant: 'current', grade },
      { variant: 'current', status: 'failed' },
    ]).current
    expect(partial.expectations.unknownTotalRuns).toBe(1)
    expect(partial.expectations.passRate).toBeNull()
    let unavailable = summarize([
      {
        status: 'grading_failed',
        expectationCount: 14,
        variant: 'current',
      },
    ]).current
    expect(unavailable.expectations.missing).toBe(14)
    expect(unavailable.expectations.failed).toBe(0)
    expect(unavailable.expectations.passRate).toBeNull()
    expect(unavailable.readability.clarity).toStrictEqual({
      samples: 0,
      mean: null,
    })
  })

  it('duplicate expectation records cannot inflate a rate above one', () => {
    let grade = validGrade()
    grade.expectations.push(grade.expectations[1])
    let result = summarize([
      {
        expectationCount: 2,
        status: 'completed',
        variant: 'current',
        grade,
      },
    ]).current
    expect(result.expectations.total).toBe(2)
    expect(result.expectations.passed).toBe(2)
    expect(result.expectations.passRate).toBe(1)
    expect(result.expectations.coverage).toBe(1)
  })

  it('grader costs are averaged separately from writer costs with missing data preserved', () => {
    let result = summarize([
      {
        gradingRun: {
          usage: JSON.parse('{"input_tokens":40,"output_tokens":7}'),
          durationMs: 50,
        },
        usage: JSON.parse('{"input_tokens":10,"output_tokens":5}'),
        status: 'completed',
        variant: 'current',
        durationMs: 100,
      },
      { status: 'grading_failed', variant: 'current', gradingRun: {} },
    ]).current
    expect(result.inputTokens).toStrictEqual({ samples: 1, mean: 10 })
    expect(result.durationMs).toStrictEqual({ samples: 1, mean: 100 })
    expect(result.grader.inputTokens).toStrictEqual({ samples: 1, mean: 40 })
    expect(result.grader.outputTokens).toStrictEqual({ samples: 1, mean: 7 })
    expect(result.grader.durationMs).toStrictEqual({ samples: 1, mean: 50 })
  })

  let metadata = { firstHeading: '# Ghostwriter', name: 'ghostwriter' }
  let skillOutput =
    '---\nname: ghostwriter\n---\n# Ghostwriter\nCore principle.'

  it('observes a successful skill read with matching content', () => {
    let command = 'cat skill/ghostwriter/SKILL.md'
    let result = observeSkillRead(
      [{ output: skillOutput, exitCode: 0, command }],
      metadata,
    )
    expect(result.observed).toBe(true)
    expect(result.evidence).toContain(command)
  })

  it('failed reads and empty output never count as skill activation', () => {
    for (let entry of [
      { command: 'cat SKILL.md', output: skillOutput, exitCode: 1 },
      { command: 'cat SKILL.md', output: skillOutput, exitCode: null },
      { command: 'cat SKILL.md', exitCode: 0, output: '' },
    ]) {
      expect(observeSkillRead([entry], metadata).observed).toBe(false)
    }
  })

  it('searching or mentioning skill metadata is not a skill read', () => {
    for (let command of [
      "rg 'name: ghostwriter|# Ghostwriter' skill/ghostwriter/SKILL.md",
      "rg 'name: ghostwriter|# Ghostwriter|cat' skill/ghostwriter/SKILL.md",
      'echo cat skill/ghostwriter/SKILL.md',
    ]) {
      let result = observeSkillRead(
        [{ output: skillOutput, exitCode: 0, command }],
        metadata,
      )
      // Pairing the verdict with its command names the failing case.
      expect({ observed: result.observed, command }).toStrictEqual({
        observed: false,
        command,
      })
    }
  })

  it('unrecognized successful read methods require inspection instead of a negative verdict', () => {
    for (let command of [
      'python3 -c "print(open(\'SKILL.md\').read())"',
      "node -e \"console.log(require('node:fs').readFileSync('SKILL.md', 'utf8'))\"",
      'readFile SKILL.md',
    ]) {
      let result = observeSkillRead(
        [{ output: skillOutput, exitCode: 0, command }],
        metadata,
      )
      // Pairing the verdict with its command names the failing case.
      expect({ observed: result.observed, command }).toStrictEqual({
        observed: null,
        command,
      })
      expect(result.evidence).toMatch(/Unknown read method/u)
    }
  })

  it('does not confuse a longer skill name with the selected skill', () => {
    let result = observeSkillRead(
      [
        {
          output: skillOutput.replace(
            'name: ghostwriter',
            'name: ghostwriter-extra',
          ),
          command: 'cat skill/other/SKILL.md',
          exitCode: 0,
        },
      ],
      metadata,
    )
    expect(result.observed).toBe(false)
  })

  it('a successful read without captured output is not a skill read', () => {
    let result = observeSkillRead(
      [{ command: 'cat skill/ghostwriter/SKILL.md', exitCode: 0 }],
      metadata,
    )
    expect(result).toStrictEqual({
      evidence:
        'No supported successful read showed the skill name and first heading.',
      observed: false,
    })
  })

  it('skill content printed by an unrecognized command requires inspection', () => {
    let command = 'python3 show_notes.py'
    let result = observeSkillRead(
      [{ output: skillOutput, exitCode: 0, command }],
      metadata,
    )
    expect(result).toStrictEqual({
      evidence: `Unknown read method; inspect the trace before scoring activation: ${command}`,
      observed: null,
    })
  })

  it('unrelated successful commands do not count as skill reads', () => {
    let result = observeSkillRead(
      [
        {
          command: "/bin/bash -lc 'node build.js'",
          output: 'Build finished.',
          exitCode: 0,
        },
      ],
      metadata,
    )
    expect(result.observed).toBe(false)
  })

  it('grading lists commands with unknown exit codes and skips records without a command', () => {
    let prompt = gradingPrompt(
      regressionCase(),
      {
        commands: [{ exitCode: 0 }, { command: 'npm test' }],
        response: 'Answer.',
      },
      'RUBRIC',
    )
    expect(prompt).toContain(
      'outputs and reads of setup files are left out):\n- exit unknown: npm test',
    )
    expect(prompt).not.toContain('- exit 0')
  })

  it.each([
    [{ expectations: 0, runs: -1 }],
    [{ expectations: 0, runs: 1.5 }],
    [{ expectations: -1, runs: 1 }],
    [{ expectations: '2', runs: 1 }],
    [{ expectations: 2 }],
  ])('rejects planned metrics that are not nonnegative integers: %j', plan => {
    expect(() => summarize([], { planned: { current: plan } })).toThrow(
      'Invalid planned metrics for variant: current',
    )
  })

  it.each([
    [{ split: 'test' }, 'Invalid split in case 1'],
    [suiteField('expected_output', undefined), 'Case 1 needs expected_output'],
    [suiteField('expected_output', ' \n '), 'Case 1 needs expected_output'],
    [suiteField('expected_output', 5), 'Case 1 needs expected_output'],
    [{ files: undefined }, 'Case 1 needs a files array'],
    [{ files: 'inputs/source.md' }, 'Case 1 needs a files array'],
  ])('rejects a regression case with %j', async (overrides, message) => {
    let filename = await suiteFile(regressionSuite([regressionCase(overrides)]))
    await expect(readSuite(filename)).rejects.toThrow(message)
  })

  it('accepts both known splits in a regression suite', async () => {
    let filename = await suiteFile(
      regressionSuite([
        regressionCase({ split: 'holdout' }),
        regressionCase({ name: 'second-note', split: 'dev', id: 2 }),
      ]),
    )
    let cases = await readSuite(filename)
    expect(cases.map(item => item.split)).toStrictEqual(['holdout', 'dev'])
  })

  it('rejects a fixture reference that names a directory', async () => {
    let { base } = await fixture()
    await mkdir(join(base, 'inputs/notes'))
    await expect(fixturePath(base, 'inputs/notes')).rejects.toThrow(
      'A fixture must be a file: inputs/notes',
    )
  })

  it('fingerprints hash relative paths and contents in code point order', async () => {
    let directory = await snapshot({
      'nested/inner.md': 'Inner\n',
      'alpha.md': 'Lower\n',
      'Zeta.md': 'Upper\n',
    })
    await expect(fingerprint(directory)).resolves.toBe(
      expectedFingerprint([
        ['Zeta.md', 'Upper\n'],
        ['alpha.md', 'Lower\n'],
        ['nested/inner.md', 'Inner\n'],
      ]),
    )
  })

  it('fingerprints do not depend on the directory listing order', async () => {
    let directory = await snapshot({
      'c.md': 'Three\n',
      'a.md': 'One\n',
      'b.md': 'Two\n',
    })
    let expected = expectedFingerprint([
      ['a.md', 'One\n'],
      ['b.md', 'Two\n'],
      ['c.md', 'Three\n'],
    ])
    await expect(fingerprint(directory)).resolves.toBe(expected)
    let actual = await vi.importActual('node:fs/promises')
    onTestFinished(() => vi.mocked(readdir).mockReset())
    vi.mocked(readdir).mockImplementationOnce(async (folder, options) =>
      (await actual.readdir(folder, options)).toSorted((left, right) =>
        right.name.localeCompare(left.name),
      ),
    )
    await expect(fingerprint(directory)).resolves.toBe(expected)
    expect(readdir).toHaveBeenLastCalledWith(directory, { withFileTypes: true })
  })

  it('fingerprints ignore the snapshot location but change with file names and content', async () => {
    let original = await fingerprint(
      await snapshot({ 'a.md': 'One\n', 'b.md': 'Two\n' }),
    )
    await expect(
      fingerprint(await snapshot({ 'b.md': 'Two\n', 'a.md': 'One\n' })),
    ).resolves.toBe(original)
    await expect(
      fingerprint(await snapshot({ 'b.md': 'Three\n', 'a.md': 'One\n' })),
    ).resolves.not.toBe(original)
    await expect(
      fingerprint(await snapshot({ 'a.md': 'One\n', 'c.md': 'Two\n' })),
    ).resolves.not.toBe(original)
  })

  it('fingerprints reject a symlink inside the snapshot', async () => {
    let directory = await snapshot({ 'rules/filler.md': 'Rule\n' })
    let link = join(directory, 'rules/linked.md')
    await symlink(join(directory, 'rules/filler.md'), link)
    await expect(fingerprint(directory)).rejects.toThrow(
      `Skill snapshots must not contain symlinks: ${link}`,
    )
  })

  it('fingerprints skip entries that are neither files nor directories', async () => {
    let directory = await snapshot({ 'SKILL.md': '# Example\n' })
    let clean = await fingerprint(directory)
    await listenOnSocket(join(directory, 'agent.sock'))
    await expect(fingerprint(directory)).resolves.toBe(clean)
    await expect(fingerprint(directory)).resolves.toBe(
      expectedFingerprint([['SKILL.md', '# Example\n']]),
    )
  })
})
