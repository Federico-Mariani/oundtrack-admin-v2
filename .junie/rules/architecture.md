# Architecture rules

Feature-first Clean Architecture. Every rule in this file that can be checked automatically **is** checked by ESLint (`eslint/architecture-boundaries.mjs`, `eslint/restricted-imports.mjs`,
`eslint/project-structure.mjs`) and produces an error. Keep this document and those files in sync.

## Top-level structure

```text
src/
├── main.ts, app/app.ts, app/app.config.ts, app/app.routes.ts   # app composition root
├── environments/                                                # environment configuration
└── app/
    ├── core/        # application-wide concerns only (e.g. HTTP envelope contract)
    ├── shared/      # feature-agnostic, reusable primitives (RequestState, StoreFacade, Id)
    └── features/    # one folder per bounded context / vertical slice
        └── <feature>/
            ├── index.ts                 # PUBLIC API — the only cross-feature entry point
            ├── <feature>.providers.ts   # composition root (DI bindings, NgRx registration)
            ├── domain/                  # pure TypeScript business model
            ├── application/
            │   ├── ports/               # interfaces implemented by infrastructure
            │   ├── tokens/              # InjectionTokens for the ports
            │   └── state/               # NgRx: actions/ reducers/ effects/ facades/, *.feature.ts
            ├── infrastructure/          # HTTP, storage, DTOs, mappers, interceptors
            ├── presentation/            # pages, components and feature-owned routing
            │   └── routing/             # <feature>.paths/.navigation/.routes, *-navigation.service, guards/
            └── testing/                 # fakes and fixtures shared by the feature's specs
```

No other folders are allowed at these levels (ESLint `project/structure/*`). A feature root may
contain only `index.ts` and `<feature>.providers.ts`.

## Layer responsibilities

| Layer                                  | Contains                                                                                                                        | Must NOT know                                                                             |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `domain/`                              | models, errors, pure functions (`isAccessTokenExpired`)                                                                         | Angular, NgRx, RxJS, HttpClient, DTOs, env, any outer layer                               |
| `application/ports                     | tokens`                                                                                                                         | interfaces (`AuthRepository`, `AuthSessionStorage`, `AccessTokenProvider`) + their tokens | state, infrastructure, presentation |
| `application/state/`                   | NgRx actions, micro-reducers, functional effects, feature, facades                                                              | infrastructure implementations, presentation                                              |
| `application/state/facades/`           | `XFacade` + micro facades: the ONLY API presentation may use                                                                    | infrastructure, presentation                                                              |
| `infrastructure/`                      | HTTP repositories, storage adapters, DTOs, mappers, interceptors                                                                | NgRx (state, actions, facades), presentation                                              |
| `presentation/`                        | Angular pages/components and feature-owned routing (`routing/`: paths, navigation commands, navigation service, routes, guards) | `@ngrx/*`, state internals, infrastructure, providers                                     |
| `<feature>.providers.ts`               | `provideX()`: binds ports → implementations, `provideState`, `provideEffects`                                                   | presentation                                                                              |
| `index.ts`                             | re-exports of what other features/app may use                                                                                   | —                                                                                         |
| `shared/`                              | cross-feature, domain-agnostic abstractions                                                                                     | features, core, app, environments; NgRx anywhere                                          |
| `shared/types`, `shared/state/request` | pure TypeScript primitives                                                                                                      | Angular, NgRx, RxJS as well                                                               |
| `core/`                                | application-wide concerns                                                                                                       | feature internals, NgRx                                                                   |

Ports whose contract needs RxJS (`Observable`) live in `application/ports`, not in `domain`.

## Dependency matrix (what each layer may import)

```text
FROM                      → ALLOWED TARGETS (same feature unless stated)
domain                    → domain, shared-pure
application (ports/tokens)→ domain, application, shared, shared-pure
application/state         → domain, application, application/state, shared, shared-pure
                            (NOT another feature's public API — state is local by default)
facades                   → domain, application, application/state, facades, shared, shared-pure
                            (NOT another feature's public API — state is local by default)
infrastructure            → domain, application (ports/tokens), infrastructure, shared, shared-pure,
                            core, environments
presentation              → domain, application (types), facades, presentation, shared, shared-pure,
                            core, other features' public API
<feature>.providers.ts    → domain, application, state, facades, infrastructure, shared, core,
                            environments, other features' public API
index.ts                  → anything inside its own feature
testing/                  → anything inside its own feature, shared, core, environments, public APIs
*.spec.ts                 → anything inside its own feature, shared, core, environments, public APIs
shared                    → shared, shared-pure
shared-pure               → shared-pure
core                      → core, shared, shared-pure, environments, feature public APIs
app (src/app/*.ts, main)  → app, core, shared, shared-pure, environments, feature public APIs
environments              → environments
```

Everything not listed is an error (`boundaries/dependencies`, default `disallow`).

## External packages per layer (`no-restricted-imports`)

- `@ngrx/*` only in `features/*/application/state/**`, `features/*/testing/**`,
  `<feature>.providers.ts`, `app.config.ts`.
- `@ngrx/signals` is forbidden everywhere. `createFeatureSelector` is forbidden everywhere.
- `domain/**` and `shared/types/**`, `shared/state/request/**`: no `@angular/*`, `@ngrx/*`,
  `rxjs`, `@environments/*`, `@app/*` (domain additionally: no `jwt-decode`).
- `shared/**`: no `@features/**`.

## Cross-feature communication

```ts
// ALLOWED (from another feature, core or app)
import { AuthFacade, authGuard, AUTH_ROUTES } from '@features/auth';

// NOT ALLOWED (anywhere: alias or relative)
import { AuthFacade } from '@features/auth/application/state/facades/auth.facade';
import { authFeature } from '../../auth/application/state/auth.feature';
import { provideAuth } from '../auth/auth.providers';
```

- `features/<feature>/index.ts` is the only cross-feature entry point. Export only what consumers
  need (facade, domain types, errors, guards, routes, `provideX`), never DTOs, mappers, actions,
  reducers, effects, implementations.
- Inside a feature use **relative** imports; use aliases only to cross boundaries:
  `@shared/*`, `@features/<feature>`, `@app/core/*`, `@environments/*`.
- When two features must collaborate, go through the public API (facade), a shared abstraction,
  or an application-level service — never through internals.

## Feature-owned routing

Each feature owns its routing. There is **no** global route config, **no** global route registry (`ROUTES`, `APP_PATHS`, `GLOBAL_NAVIGATION`, ...) and **no** global God `RouterService` that knows
every feature. A feature's routing lives in `presentation/routing/` (a presentation concern) and
contains, when needed:

- `<feature>.paths.ts` — route **segments**, the single source of truth (`AUTH_PATHS`), plus
  feature-specific query-param / route-param keys. Not full URLs.
- `<feature>.navigation.ts` — pure, framework-light, typed navigation commands derived only from the
  paths (`AUTH_NAVIGATION.login() === ['/', 'login']`).
- `<feature>-navigation.service.ts` — the only place that encapsulates the Angular `Router` for
  imperative navigation; injectable (`providedIn: 'root'`), knows the Router only (never the Store,
  actions or feature state). Navigation methods return `Promise<boolean>` / `UrlTree` so the caller
  decides to `await` or `void`.
- `<feature>.routes.ts` — the feature `Routes`, lazily loading pages (`loadComponent` /
  `loadChildren`).
- `routing/guards/` — functional guards (`CanActivateFn` / `CanMatchFn`) that redirect by returning
  a `UrlTree` and consume only the feature facade.

`app.routes.ts` is **composition only**: it lazily composes each feature's public routing API (`FEATURE_ROUTES`), app-level redirects and the `**` fallback. It never imports feature internals (pages, guards, paths). The `**` wildcard is a matcher, never a navigable URL. A feature exposes
through its `index.ts` only what the app or other features consume for routing (`FEATURE_ROUTES`,
and `FeatureNavigationService` / `FEATURE_PATHS` when actually needed cross-boundary); pages, route
params and private routing helpers stay internal.

Declarative navigation stays declarative (`routerLink` / `routerLinkActive` in templates); the
navigation service is for imperative TypeScript navigation. Cross-feature navigation goes through the
target feature's public API (`import { AuthNavigationService } from '@features/auth'`), never through
a global router. Routing files are classified as `feature-presentation` by ESLint, so routing cannot
import infrastructure or NgRx internals, and `app` cannot import feature internals. See
`.junie/rules/routing.md` for the full routing conventions.

## Feature state is local by default

NgRx state management is **feature-local by default**. A feature's reducers, effects, actions and
facades must not depend directly on the state manager of another bounded context — not even through
its public API. This stops effects from silently becoming a global orchestrator across features and
keeps each store independently reasoned about and tested. ESLint enforces it: `feature-application-state`
and `feature-facade` cannot import `@features/<other-feature>`.

```text
GOOD
Presentation A      → Public API B           (a page may use AuthFacade from @features/auth)
App composition     → Public APIs A / B       (app.config.ts / app.routes.ts / providers)
Effect A            → own Repository Port     (collaborate via an application contract)

BAD
Effect A            → Facade B                (state-manager-to-state-manager coupling)
Effect A            → Store/Actions B
Reducer A           → Feature B internals
```

If a feature's state genuinely must depend on another bounded context, prefer first: an **application
port**, a **shared domain-neutral contract**, or **input passed from a composition/orchestration
layer** — before reaching for `Effect A → Facade B`. Such a dependency is **opt-in**: add a narrow,
documented exception to `eslint/architecture-boundaries.mjs` for that specific case only; never open a
wildcard between all features, and do not introduce a global event bus / mediator / command bus to
work around the rule. Today there are **no** cross-feature application-state exceptions.

## Project structure: strict but intentionally evolvable

`eslint/project-structure.mjs` rejects any folder the architecture does not foresee (e.g. a stray
`src/app/services/` or `features/<feature>/application/helpers/`). This prevents accidental drift, not
intentional evolution. A new, semantically valid category (for example `domain/value-objects`,
`domain/services`, `application/services`, `presentation/components`) is **not** architecturally wrong
by definition — it is simply **forbidden until it is intentionally added to the architecture rules**.
When a task genuinely needs a new architectural folder, do **not** bypass `project-structure` with a
disable: update `eslint/project-structure.mjs` (and this document) on purpose and explain why the
category exists. Never create generic buckets (`services/`, `managers/`, `helpers/`, `common/`) and
then add an exception just to make lint pass.

## Composition roots

`app.config.ts`, `app.routes.ts` and `<feature>.providers.ts` wire the application. They are the
only places that may bind ports to infrastructure implementations and register NgRx state/effects.
Infrastructure that needs application state (e.g. the HTTP interceptor needs the access token)
consumes a **port** (`AccessTokenProvider`) bound in the providers file — never the facade or the
store directly.

## Examples

```ts
// ALLOWED
// features/auth/application/state/effects/auth-login.effects.ts
import { AUTH_REPOSITORY } from '../../tokens/auth-repository.token';
// features/auth/infrastructure/storage/local-storage-auth-session.storage.ts
import type { AuthSessionStorage } from '../../application/ports/auth-session-storage';
// features/auth/presentation/pages/login/login-page.ts
import { AuthFacade } from '../../../application/state/facades/auth.facade';
// features/home/presentation/routing/home.routes.ts
import { authGuard } from '@features/auth';

// NOT ALLOWED
// features/auth/domain/models/user.ts
import { Injectable } from '@angular/core'; // domain → Angular
// features/auth/application/state/effects/auth-login.effects.ts
import { HttpAuthRepository } from '../../../infrastructure/...'; // state → implementation
// features/auth/infrastructure/http/auth-token.interceptor.ts
import { AuthFacade } from '../../application/state/facades/...'; // infrastructure → facade
// features/auth/presentation/pages/login/login-page.ts
import { Store } from '@ngrx/store'; // presentation → NgRx
// shared/state/store-facade.ts
import { AuthFacade } from '@features/auth'; // shared → feature
```
