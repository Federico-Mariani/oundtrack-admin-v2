// @ts-check
import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier/flat';
import angular from 'angular-eslint';
import tseslint from 'typescript-eslint';
import { architectureBoundaries } from './eslint/architecture-boundaries.mjs';
import { projectStructure } from './eslint/project-structure.mjs';
import { restrictedImports } from './eslint/restricted-imports.mjs';

/**
 * ESLint composition root.
 *
 * - correctness / code quality:  @eslint/js + typescript-eslint (type-aware, strict)
 * - Angular best practices:      angular-eslint (TS + templates + accessibility)
 * - architecture:                eslint/architecture-boundaries.mjs, eslint/restricted-imports.mjs,
 *                                eslint/project-structure.mjs
 * - formatting:                  Prettier only (eslint-config-prettier disables conflicting rules)
 *
 * Severity policy: everything is an error. `npm run lint` runs with
 * `--max-warnings=0`, so a passing lint means zero findings.
 */
export default defineConfig([
  globalIgnores(['dist/', 'coverage/', '.angular/', 'node_modules/']),

  // ------------------------------------------------------------------ config files (plain JS)
  {
    name: 'project/config-files',
    files: ['*.mjs', 'eslint/**/*.mjs'],
    extends: [eslint.configs.recommended],
    languageOptions: { sourceType: 'module' },
  },

  // ------------------------------------------------------------------ TypeScript sources
  {
    name: 'project/typescript',
    files: ['src/**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // ---- Angular conventions
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/prefer-inject': 'error',
      '@angular-eslint/prefer-standalone': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/relative-url-prefix': 'error',

      // ---- TypeScript: strong typing at module boundaries
      '@typescript-eslint/no-explicit-any': 'error',
      // Angular root/shell components are legitimately empty decorated classes.
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/consistent-type-exports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-useless-constructor': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      // Angular `Validators.required` & co. are static and `this`-free.
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],

      // ---- general code quality (correctness, not style)
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-fallthrough': 'error',
      'no-duplicate-imports': 'error',
      'no-unreachable': 'error',
      'no-useless-constructor': 'off', // replaced by the @typescript-eslint variant
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Prefer string literal union types over enums.',
        },
      ],
    },
  },

  // ------------------------------------------------------------------ specs: relax what only gets in the way in tests
  {
    name: 'project/typescript-specs',
    files: ['src/**/*.spec.ts'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },

  // ------------------------------------------------------------------ architecture
  architectureBoundaries,
  ...restrictedImports,
  ...projectStructure,

  // ------------------------------------------------------------------ Angular templates
  {
    name: 'project/angular-templates',
    files: ['src/**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/prefer-self-closing-tags': 'error',
    },
  },

  // Must be last: turns off every rule that would conflict with Prettier.
  prettier,
]);
