import { fileURLToPath } from 'node:url'

import { readSuite } from './evaluation.js'

/**
 * Validate the regression and trigger suites and print their sizes.
 *
 * @param {URL} [fixtures] - Directory that holds both suite files.
 * @returns {Promise<number>} Exit code for the process.
 */
export async function checkFixtures(
  fixtures = new URL('../../test/fixtures/', import.meta.url),
) {
  try {
    let cases = await readSuite(
      fileURLToPath(new URL('regression-tasks.json', fixtures)),
    )
    let triggers = await readSuite(
      fileURLToPath(new URL('triggers.json', fixtures)),
      'triggers',
    )
    console.info(
      `Valid evaluation data: ${cases.length} tasks, ${
        triggers.length
      } trigger queries`,
    )
    return 0
  } catch (error) {
    console.error(error.message)
    return 1
  }
}
