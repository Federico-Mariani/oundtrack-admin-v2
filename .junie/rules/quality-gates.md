# Quality gates

A task that modifies code is **not complete** until every applicable command below passes.
`npm run quality` is CI-ready: it fails on the first violation.

| Command                | Checks                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm run lint`         | ESLint, `--max-warnings=0`: correctness, architecture boundaries, restricted imports, folder structure, Angular/TS rules |
| `npm run lint:fix`     | Same, applying safe auto-fixes (import type, etc.)                                                                       |
| `npm run format:check` | Prettier (`prettier.config.mjs`) — formatting only                                                                       |
| `npm run format`       | Prettier write                                                                                                           |
| `npm run typecheck`    | `tsc -p tsconfig.app.json --noEmit && tsc -p tsconfig.spec.json --noEmit`                                                |
| `npm run quality`      | `lint` + `format:check` + `typecheck`                                                                                    |
| `npm test`             | Vitest via `ng test`                                                                                                     |
| `npm run build`        | `ng build` (production)                                                                                                  |

## Workflow for every code change

1. Implement; keep files small and inside the right layer (`architecture.md`).
2. `npm run lint:fix` then `npm run format`.
3. `npm run quality`.
4. `npm test` and `npm run build` when the change touches runtime code, tests or configuration.
5. Report the real results. Never declare success with a failing command.

## ESLint policy

- Severity is always `error`; there are no warnings to ignore.
- **Do not bypass a rule** to go green:
  - no `/* eslint-disable */` or file-level disables;
  - no lowering a severity, deleting a rule or adding a config exception for existing code;
  - no `any` / `unknown as X` / `@ts-ignore` to silence the type checker.
- If a violation is reported: decide whether the code really violates the architecture.
  If yes → fix the code (move the file, introduce a port, use the facade, split the file).
  Only if the boundary genuinely foresees the case → adjust the config in a **generic, documented**
  way (never Auth-specific), and update `.junie/rules/architecture.md` to match.
- A `// eslint-disable-next-line <rule> -- <reason>` is tolerated only when local, naming the rule,
  with a reason, and when no better design exists. `reportUnusedDisableDirectives` is on by
  default in ESLint 10: stale disables are errors.
- ESLint is the executable source of truth; `.junie/rules/*.md` document intent and the rules that
  cannot be automated. Keep them consistent; do not describe different architectures in different places.

## Formatting

Prettier owns formatting (`singleQuote`, `semi`, `trailingComma: all`, `printWidth: 100`,
`tabWidth: 2`, `endOfLine: lf`, Angular parser for `.html`). ESLint does not run Prettier and does
not enforce style rules that Prettier handles (`eslint-config-prettier` is last in the config).
Run `npm run format` rather than hand-formatting.

## Tooling versions

ESLint 10 flat config (`eslint.config.mjs`), typescript-eslint 8 (type-aware via `projectService`),
angular-eslint 22, eslint-plugin-boundaries 7, eslint-import-resolver-typescript (path aliases),
eslint-config-prettier 10, Prettier 3. Do not add `husky`/`lint-staged` or `eslint-plugin-prettier`
without an explicit request.
