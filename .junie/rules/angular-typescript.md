# Angular & TypeScript rules

Target: Angular 22, TypeScript 6, strict mode. ESLint (`eslint.config.mjs`) enforces the ⚙ items;
the rest is mandatory convention.

## Modern Angular only

Prefer, whenever the API exists for the installed version:

- ⚙ standalone components/directives/pipes (`prefer-standalone`); no NgModules.
- ⚙ `inject()` instead of constructor injection (`prefer-inject`):
  `private readonly auth = inject(AuthFacade);`
- ⚙ `ChangeDetectionStrategy.OnPush` on every component.
- ⚙ Signals, `computed()`, signal `input()` / `output()` / `model()` (`prefer-signals`, `prefer-output-readonly`).
- ⚙ Native control flow `@if` / `@for` / `@switch` (`template/prefer-control-flow`); self-closing tags.
- Functional guards (`CanActivateFn`), functional interceptors (`HttpInterceptorFn`), route-level
  providers, `provideAppInitializer`, lazy `loadComponent` / `loadChildren`.
- Typed reactive forms (`NonNullableFormBuilder`, `FormGroup<Interface>`).
- ⚙ Selectors prefixed `app-` (components kebab-case, directives camelCase).
- Do **not** rewrite working code only to use a newer API when it brings no concrete benefit.

Components only: render data, receive input, emit events, call facade actions, derive UI-only
state. Business logic lives in domain / application.

## Strict TypeScript

- ⚙ No `any`; no `unknown as X` to silence the compiler. Narrow with type guards (see `toApiErrorBody` in `auth-error.mapper.ts`).
- ⚙ Type-aware strictness: no unsafe assignment/call/member access, no floating or misused
  promises (`void router.navigate(...)` when the result is intentionally ignored), no unnecessary
  type assertions, no unused variables (`_` prefix for intentionally unused).
- ⚙ `import type { … }` / inline `type` specifiers for type-only imports; `export type` for
  type-only re-exports.
- ⚙ Exported functions and class members declare explicit types at module boundaries (`explicit-module-boundary-types`); internal arrow functions may rely on inference.
- ⚙ `interface` over `type` for object shapes; string-literal unions instead of `enum`.
- ⚙ `readonly` on members never reassigned; immutable state (spread, never mutate).
- ⚙ `eqeqeq`, `curly`, no fallthrough, no duplicate imports, no useless constructors.
- Explicit generics where a default would hide a modelling decision (`RequestState<RequestError>`).
- Pure functions for mappers and shared primitives; no `@Injectable()` for stateless functions.

## Files and naming

- **One primary concept per file.** A file exports one main thing and is named after it.
- kebab-case filenames with a role suffix when it adds clarity:
  `movies-load.actions.ts`, `movies-load.reducer.ts`, `movies-load.effects.ts`,
  `movies-store-data.facade.ts`, `http-movies.repository.ts`, `local-storage-auth-session.storage.ts`,
  `auth-session.mapper.ts`, `tokens-response.dto.ts`, `movies-repository.token.ts`,
  `movies-page.ts`, `auth.guards.ts`, `movies.routes.ts`.
- Domain models and ports are plain nouns without suffix: `movie.model.ts`, `auth-session.ts`,
  `movies-repository.port.ts`, `auth-session-storage.ts`.
- Spec files sit next to the code they test: `x.ts` → `x.spec.ts`.
- Forbidden: generic catch-all files such as `utils.ts`, `helpers.ts`, `common.ts`, `types.ts`,
  `interfaces.ts`, `models.ts`, `constants.ts`, `*-api.dto.ts`, `*-api.mappers.ts` that aggregate
  independent concepts. Split them. (Not ESLint-enforced — reviewers and agents must refuse them.)
- Forbidden names: `Manager`, `Handler`, `Helper`, `Util`, `Base`, `Data`, `Service` when a precise
  domain name exists (`AuthApi`, `HttpMoviesRepository`, `AuthSessionStorage`).
- No barrel `index.ts` except `features/<feature>/index.ts` (public API).
- Folder structure is ⚙ enforced (`eslint/project-structure.mjs`): see `architecture.md`.

## Small files, zero duplication

> Extract repeated behavior, not repeated syntax at any cost.

- When several files share the same behavior (same concept, changes together, same layer),
  extract it into the correct layer (`shared/` if cross-feature and domain-agnostic, otherwise
  inside the feature) with a semantic name.
- Do not build generic internal frameworks (factories of factories, reflection, magic decorators)
  to save a few lines. Clarity first.
- Do not generalize concepts that only look similar; share semantically identical behavior only.

## Angular DI & boundaries

- Ports are interfaces + `InjectionToken` (`application/ports`, `application/tokens`); bindings live
  only in `<feature>.providers.ts` (`useClass`, `useExisting`).
- Implementation classes bound through a token use plain `@Injectable()`; `providedIn: 'root'` is
  for services consumed directly by their class (facades).
- Infrastructure never injects facades or `Store`; it consumes ports.
- `environment` is imported only by infrastructure and composition roots, via `@environments/*`.
