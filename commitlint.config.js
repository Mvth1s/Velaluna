module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'content', 'docs', 'refactor', 'test', 'ci', 'perf', 'revert']
    ],
    'body-max-line-length': [0],
    'footer-max-line-length': [0]
  }
}
