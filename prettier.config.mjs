// @ts-check

/**
 * Formatting only. Correctness, architecture and code-quality rules live in
 * ESLint (`eslint.config.mjs`); `eslint-config-prettier` keeps the two from
 * overlapping.
 *
 * @type {import('prettier').Config}
 */
export default {
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  endOfLine: 'lf',
  overrides: [
    {
      files: '*.html',
      options: { parser: 'angular' },
    },
  ],
};
