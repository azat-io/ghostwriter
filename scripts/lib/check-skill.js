import { relative } from 'node:path'

import { validateSkill } from './skill-validation.js'

/**
 * Validate a skill directory and print the result.
 *
 * @param {string[]} arguments_ - Command-line arguments after the script path.
 * @returns {Promise<number>} Exit code for the process.
 */
export async function checkSkill(arguments_) {
  if (arguments_.length > 1) {
    console.error('Usage: node scripts/check-skill.js [skill-directory]')
    return 1
  }
  let result = await validateSkill(arguments_[0] ?? 'skills/ghostwriter')
  for (let error of result.errors) {
    console.error(`${relative(process.cwd(), error.file)}: ${error.message}`)
  }
  if (result.errors.length > 0) {
    console.error(`Skill validation failed: ${result.errors.length} error(s).`)
    return 1
  }
  console.info(
    `Skill validation passed: ${result.filesChecked} Markdown files, ${result.ruleCount} rules.`,
  )
  return 0
}
