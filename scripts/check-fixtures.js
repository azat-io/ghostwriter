import { checkFixtures } from './lib/check-fixtures.js'

process.exitCode = await checkFixtures()
