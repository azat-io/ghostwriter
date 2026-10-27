import { runEvaluations } from './lib/run-evaluations.js'

let controller = new AbortController()
process.once('SIGINT', () => controller.abort())
process.once('SIGTERM', () => controller.abort())

try {
  process.exitCode = await runEvaluations(process.argv.slice(2), {
    signal: controller.signal,
  })
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
