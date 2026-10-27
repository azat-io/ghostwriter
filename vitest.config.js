import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        statements: 100,
        functions: 100,
        branches: 100,
        lines: 100,
      },
      include: ['scripts/lib/**'],
      provider: 'v8',
    },
    exclude: [...configDefaults.exclude, 'test/fixtures/**'],
    include: ['test/**/*.test.js'],
  },
})
