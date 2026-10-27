import { defineConfig } from 'cspell'

export default defineConfig({
  ignorePaths: [
    '.github',
    'changelog.md',
    'license',
    'pnpm-lock.yaml',
    'test/fixtures',
    'tsconfig.json',
  ],
  dictionaries: ['css', 'html', 'node', 'npm', 'typescript'],
  words: ['azat', 'changelogithub', 'unstub'],
  useGitignore: true,
  language: 'en',
})
