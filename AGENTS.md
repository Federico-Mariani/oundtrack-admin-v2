# Project rules for AI agents and developers

This is an Angular 22 application built with Clean Architecture, pragmatic DDD and the
NgRx Global Store (`createFeature` / `createActionGroup` / `createReducer` / functional
effects / facades). The detailed, **mandatory** project rules live in `.junie/rules/`:

| File                                 | Scope                                                     |
| ------------------------------------ | --------------------------------------------------------- |
| `.junie/rules/architecture.md`       | Layers, dependency rule, feature public API, aliases      |
| `.junie/rules/ngrx.md`               | NgRx conventions, facades, request state, concurrency     |
| `.junie/rules/angular-typescript.md` | Modern Angular APIs, strict TypeScript, file organization |
| `.junie/rules/routing.md`            | Feature-owned routing: paths, navigation, guards, lazy    |
| `.junie/rules/testing.md`            | What to test, where, and how                              |
| `.junie/rules/i18n.md`               | Transloco i18n: feature-owned scopes, JSON, boundaries    |
| `.junie/rules/quality-gates.md`      | Commands that must pass before a task is complete         |

## Non-negotiables

- The architecture boundaries are **constraints, not suggestions**. ESLint (`eslint.config.mjs` + `eslint/*.mjs`) is the
  executable source of truth for everything
  it can verify; the rule files explain the intent and cover what ESLint cannot check.
- Never bypass a lint error: no `eslint-disable`, no lowered severity, no new exception
  in the ESLint config just to make existing code pass. If code violates the architecture, **fix the code**. A disable
  is acceptable only when local, rule-specific and explained
  in a comment.
- Respect the dependency rule: `presentation → facade → application/state → domain`,
  `infrastructure → domain / application ports`. `shared` never depends on features;
  `core` may compose feature public APIs but never imports feature internals. Features
  talk to each other only through `@features/<feature>` (index.ts).
- Keep the NgRx architecture: no `@ngrx/signals` / SignalStore, no `createFeatureSelector`,
  no `Store` in presentation, no global loading/pending state.
- Small focused files, one primary concept per file, kebab-case names, no `any`,
  no generic catch-all files (`utils.ts`, `helpers.ts`, `types.ts`, ...).

## Before finishing any task that touches code

Run `npm run quality` (lint + format check + type check), then `npm test` and
`npm run build` when the change can affect them. Do not report a task as done while any
of them fails because of your changes.

## Styling and pull requests

- Use Tailwind utility classes for layout and visual styling. Create component CSS files only for specialized styling that needs dedicated CSS, such as browser-specific range-input pseudo-elements.
- For every UI task, inspect and reuse existing app components first. Wrap Spartan primitives in focused, reusable app components under `shared/ui` before using new controls in feature templates.
- Use readable section spacing and consistent padding in dialogs. Soundtrack forms use full-width primary and secondary actions, not compact buttons crowded into a corner.
- File selection must support both keyboard-accessible browsing and drag and drop, with a dashed target, inline errors and a Spartan Attachment-based file summary. Keep file validation and upload workflows outside the reusable presentation control.
- Do not add CSS/SCSS files or inline style blocks for ordinary UI work; use Tailwind classes. Dedicated CSS requires a concrete behavior that utilities cannot express.
- Write pull request titles and descriptions in English.

## State conventions

- Follow `.junie/rules/ngrx.md`: shared request action factories, per-operation `RequestState`, and `StoreFacade` composed from data, requests and actions.
- Centralize each feature identity and operation labels in dependency-free feature-local definitions. Do not repeat raw feature names in action factory calls.
- Model finite statuses, codes and discriminants with named `as const` definitions and derived union types. Use named members or semantic queries instead of raw-string comparisons.
- These naming conventions guide new and migrated code; do not claim existing call sites have been migrated without changing and verifying them.

## Purpose-driven architecture

- Classify files by responsibility using the table in `.junie/rules/architecture.md`.
  Commands, queries, form values, workflow phases and view models are not domain models.
- Reuse the Soundtracks capability from Movies and TvSeries through its public API.
  Do not duplicate its editor, repository, upload lifecycle or request state.
- Use semantic names, focused files and Prettier formatting. Review files above 250 lines
  for separable responsibilities; do not introduce generic frameworks just to reduce lines.
- Update generic structure enforcement and architecture documentation together when adding
  a legitimate folder category. Never add feature-specific lint exemptions.
