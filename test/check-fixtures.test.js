import { onTestFinished, describe, expect, it, vi } from 'vitest'
import { writeFile, mkdtemp, mkdir, rm } from 'node:fs/promises'
import { pathToFileURL } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

import { checkFixtures } from '../scripts/lib/check-fixtures.js'

async function fixtures({ regression, triggers }) {
  let directory = await mkdtemp(join(tmpdir(), 'check-fixtures-test-'))
  onTestFinished(() => rm(directory, { recursive: true, force: true }))
  await mkdir(join(directory, 'inputs/notes'), { recursive: true })
  await writeFile(join(directory, 'inputs/notes/source.md'), '# Source\n')
  await writeSuite(directory, 'regression-tasks.json', regression)
  await writeSuite(directory, 'triggers.json', triggers)
  return { url: pathToFileURL(`${directory}/`), directory }
}

function validSuites() {
  return {
    regression: regressionSuite([
      regressionCase({ files: ['inputs/notes/source.md'] }),
      regressionCase({ split: 'holdout', id: 2 }),
    ]),
    triggers: {
      queries: [
        triggerQuery(1, true),
        triggerQuery(2, false),
        triggerQuery(3, true),
      ],
    },
  }
}

function regressionCase(overrides = {}) {
  return {
    ...suiteField('expected_output', 'The note keeps the deadline.'),
    prompt: 'Edit this note: The import finishes at noon.',
    expectations: ['The deadline stays at noon.'],
    files: [],
    id: 1,
    ...overrides,
  }
}

function captureConsole() {
  let error = vi.spyOn(console, 'error').mockImplementation(() => {})
  let info = vi.spyOn(console, 'info').mockImplementation(() => {})
  onTestFinished(() => {
    error.mockRestore()
    info.mockRestore()
  })
  return { error, info }
}

async function writeSuite(directory, name, data) {
  if (data !== undefined) {
    await writeFile(join(directory, name), JSON.stringify(data))
  }
}

function triggerQuery(id, label) {
  return { ...suiteField('should_trigger', label), prompt: 'Edit this.', id }
}

function regressionSuite(cases) {
  // cspell:disable-next-line
  return { evals: cases }
}

// Suite files keep the skill-creator field names, which are snake_case.
function suiteField(name, value) {
  return Object.fromEntries([[name, value]])
}

describe('check-fixtures', () => {
  it('validates the bundled fixtures by default', async () => {
    let output = captureConsole()
    await expect(checkFixtures()).resolves.toBe(0)
    expect(output.info).toHaveBeenCalledExactlyOnceWith(
      'Valid evaluation data: 40 tasks, 20 trigger queries',
    )
    expect(output.error).not.toHaveBeenCalled()
  })

  it('prints the sizes of valid suites in another directory', async () => {
    let { url } = await fixtures(validSuites())
    let output = captureConsole()
    await expect(checkFixtures(url)).resolves.toBe(0)
    expect(output.info).toHaveBeenCalledExactlyOnceWith(
      'Valid evaluation data: 2 tasks, 3 trigger queries',
    )
    expect(output.error).not.toHaveBeenCalled()
  })

  it.each([
    [
      'an empty regression suite',
      { regression: regressionSuite([]) },
      'The suite must contain a nonempty list of cases',
    ],
    [
      'a regression case without expectations',
      { regression: regressionSuite([regressionCase({ expectations: [] })]) },
      'Case 1 needs nonempty expectations',
    ],
    [
      'a regression fixture outside inputs',
      {
        regression: regressionSuite([
          regressionCase({ files: ['regression-tasks.json'] }),
        ]),
      },
      'Fixture files must be inside inputs/: regression-tasks.json',
    ],
    [
      'a trigger query without a boolean label',
      { triggers: { queries: [triggerQuery(1, 'true')] } },
      'Case 1 needs a boolean should_trigger',
    ],
    [
      'a trigger suite without queries',
      { triggers: regressionSuite([regressionCase()]) },
      'The suite must contain a nonempty list of cases',
    ],
  ])('reports %s and fails', async (_, change, message) => {
    let { url } = await fixtures({ ...validSuites(), ...change })
    let output = captureConsole()
    await expect(checkFixtures(url)).resolves.toBe(1)
    expect(output.error).toHaveBeenCalledExactlyOnceWith(message)
    expect(output.info).not.toHaveBeenCalled()
  })

  it.each([
    ['regression-tasks.json', 'regression'],
    ['triggers.json', 'triggers'],
  ])('reports a missing %s and fails', async (name, suite) => {
    let { directory, url } = await fixtures({
      ...validSuites(),
      [suite]: undefined,
    })
    let output = captureConsole()
    await expect(checkFixtures(url)).resolves.toBe(1)
    expect(output.error).toHaveBeenCalledExactlyOnceWith(
      expect.stringContaining(
        `ENOENT: no such file or directory, open '${join(directory, name)}'`,
      ),
    )
    expect(output.info).not.toHaveBeenCalled()
  })

  it('reports malformed JSON and fails', async () => {
    let { directory, url } = await fixtures(validSuites())
    await writeFile(join(directory, 'triggers.json'), '{"queries": [')
    let output = captureConsole()
    await expect(checkFixtures(url)).resolves.toBe(1)
    expect(output.error).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching(/JSON/u),
    )
    expect(output.info).not.toHaveBeenCalled()
  })
})
