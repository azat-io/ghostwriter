export default {
  types: {
    perf: {
      title: '🏎 Performance Improvements',
    },
    fix: {
      title: '🐞 Bug Fixes',
    },
    feat: {
      title: '🚀 Features',
    },
    refactor: false,
    style: false,
    chore: false,
    build: false,
    test: false,
    docs: false,
    ci: false,
  },
  templates: {
    commitMessage: 'build: publish v{{newVersion}}',
  },
}
