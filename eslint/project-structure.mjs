// @ts-check

/**
 * Folder-structure guard.
 *
 * eslint-plugin-boundaries classifies files by walking UP the folder tree, so
 * a file in an unexpected folder (e.g. `src/app/utils/`) would silently be
 * classified as its closest known ancestor (`app`). These blocks close that
 * gap: any TypeScript file in a folder the architecture does not foresee is
 * reported, with a message explaining where it should live.
 *
 * Implemented with the built-in `no-restricted-syntax` on `Program` (fires
 * once per file) instead of a custom rule.
 */

/**
 * @param {string} name
 * @param {string[]} files globs selecting the forbidden locations
 * @param {string[]} ignores globs of the allowed locations carved out of `files`
 * @param {string} message
 */
function forbidLocation(name, files, ignores, message) {
  return {
    name: `project/structure/${name}`,
    files,
    ignores,
    rules: {
      'no-restricted-syntax': ['error', { selector: 'Program', message }],
    },
  };
}

export const projectStructure = [
  forbidLocation(
    'app-root',
    ['src/app/*/**/*.ts'],
    ['src/app/core/**', 'src/app/shared/**', 'src/app/features/**', 'src/app/presentation/**'],
    'Unknown top-level folder under src/app. Allowed: core/ (application-wide concerns), shared/ (feature-agnostic primitives), presentation/ (app shell: layouts, shared UI components and app-level i18n), features/<feature>/ (bounded contexts).',
  ),
  forbidLocation(
    'feature-root-files',
    ['src/app/features/*/*.ts'],
    ['src/app/features/*/index.ts', 'src/app/features/*/*.providers.ts'],
    'A feature root may only contain index.ts (public API) and <feature>.providers.ts (composition root). Put the file in domain/, application/, infrastructure/, presentation/ or testing/.',
  ),
  forbidLocation(
    'feature-layers',
    ['src/app/features/*/*/**/*.ts'],
    [
      'src/app/features/*/domain/**',
      'src/app/features/*/application/**',
      'src/app/features/*/infrastructure/**',
      'src/app/features/*/presentation/**',
      'src/app/features/*/testing/**',
    ],
    'Unknown layer folder inside a feature. Allowed: domain/, application/, infrastructure/, presentation/, testing/.',
  ),
  forbidLocation(
    'application-layer',
    ['src/app/features/*/application/*/**/*.ts'],
    [
      'src/app/features/*/application/ports/**',
      'src/app/features/*/application/tokens/**',
      'src/app/features/*/application/state/**',
    ],
    'Unknown folder inside application/. Allowed: ports/ (interfaces), tokens/ (InjectionTokens), state/ (NgRx actions, reducers, effects, facades).',
  ),
];
