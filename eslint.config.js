import eslintConfig from '@azat-io/eslint-config'
import { globalIgnores } from 'eslint/config'

export default [
  globalIgnores(['test/fixtures/inputs/']),
  ...(await eslintConfig({
    perfectionist: true,
    vitest: true,
    node: true,
  })),
]
