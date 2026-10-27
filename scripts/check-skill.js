import { checkSkill } from './lib/check-skill.js'

process.exitCode = await checkSkill(process.argv.slice(2))
