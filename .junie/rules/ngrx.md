# NgRx rules

State management uses the **NgRx Global Store with modern standalone APIs**. The Auth feature (`src/app/features/auth/application/state/`) is the reference implementation: copy its shape for
every new feature state.

## Mandatory standard

| Concern      | Use                                                                                                                                               | File                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| State shape  | `interface XState` + `initialXState`, only source state                                                                                           | `x.state.ts`                         |
| Actions      | `createActionGroup({ source, events })`, one group per capability                                                                                 | `actions/x-<capability>.actions.ts`  |
| Reducers     | micro-reducers = arrays of `on()` per capability                                                                                                  | `reducers/x-<capability>.reducer.ts` |
| Root reducer | `createReducer(initialXState, ...micro reducers)` — composition only                                                                              | `x.reducer.ts`                       |
| Feature      | `createFeature({ name, reducer, extraSelectors })`                                                                                                | `x.feature.ts`                       |
| Effects      | `createEffect(() => ..., { functional: true })`, DI via `inject()` default params                                                                 | `effects/x-<capability>.effects.ts`  |
| Facades      | `XFacade extends StoreFacade` + `XStoreDataFacade`, `XStoreLoadingStatusesFacade`, `XStoreErrorStatusesFacade`, `XStoreActionsFacade`             | `facades/*.facade.ts`                |
| Registration | `provideState(xFeature)` + `provideEffects(...)` in `<feature>.providers.ts`; `provideStore()` + `provideStoreDevtools()` once in `app.config.ts` |                                      |

Action names must read well in Redux DevTools: `[Auth Login] Requested`,
`[Auth Login API] Succeeded`, `[Auth Session Storage] Restore Succeeded`.

## Forbidden (ESLint-enforced where marked ⚙)

- ⚙ `@ngrx/signals` / `signalStore` / `signalStoreFeature` / `rxMethod` / `withState` …
- ⚙ `createFeatureSelector` — `createFeature` already generates `selectXState` and one selector per
  top-level property. Never hand-write `select<Property>` that `createFeature` provides.
- ⚙ `Store`, `authFeature`, actions in `presentation/**` — the UI knows only the facade.
- ⚙ `@ngrx/*` outside `application/state/**`, `testing/**`, `<feature>.providers.ts`, `app.config.ts`.
- Class-based actions, `enum ActionTypes`, `switch (action.type)`, `StoreModule`/`EffectsModule`,
  NgModules created for NgRx.
- A `selectors/` folder duplicating generated selectors. Derived state lives in `extraSelectors`
  (split into `extra-selectors/` only if `x.feature.ts` becomes genuinely hard to read).
- Global `pendingOperation`, global `isLoading`, global `error`, `if (isLoading) return` locks.
- Storing derivable values in state (`isAuthenticated`, `accessToken`, `userFullName` are selectors).
- Business logic in facades (`computed()` re-deriving what a selector already provides), local
  Signals mirroring the store, or facades holding state.
- `LoginUseCase`-style classes that only forward to a repository; effects depend on the port directly.

## Request state (shared primitive)

Every async operation owns its **own** `RequestState<E>` in the feature state (`loginRequest`, `currentUserRequest`, …) built from `@shared/state/request`:

- `request-status.ts` → `'idle' | 'pending' | 'success' | 'error'`
- `request-state.ts` → `RequestState<E>` (error type is mandatory; `RequestState<never>` for infallible ops)
- `request-state.transitions.ts` → `idleRequest()`, `pendingRequest()`, `succeededRequest()`, `failedRequest(error)`
- `request-state.queries.ts` → `isRequestPending()`, `requestError()` (use them as selector projectors)

Reducers must read `loginRequest: pendingRequest()`, never `{ status: 'pending', error: null }`
inline. Independent operations may be pending at the same time; errors never overwrite each other.

## Facade pattern

```ts
// Presentation
private readonly auth = inject(AuthFacade);
readonly user = this.auth.data.user;                         // Signal
readonly isLoggingIn = this.auth.loadingStatuses.isLoggingIn; // Signal
readonly loginError = this.auth.errorStatuses.login;          // Signal
login(credentials: LoginCredentials): void { this.auth.actions.login(credentials); }
```

- Data / loading / error facades expose `store.selectSignal(xFeature.select…)` only — no dispatch.
- The actions facade is the only place that dispatches; it exposes intent methods (`login`, `logout`).
- `XFacade` is a composition root over the micro facades via `StoreFacade` (shared) and Angular DI.
- Infrastructure that needs state (e.g. the HTTP interceptor) gets it through an application **port**
  bound in the providers file (`ACCESS_TOKEN_PROVIDER → AuthStoreDataFacade`), never via the facade.

## Effects & concurrency

Choose the RxJS operator per operation semantics and say why in a comment:

| Operator     | Use when                                                | Auth example                    |
| ------------ | ------------------------------------------------------- | ------------------------------- |
| `exhaustMap` | repeated triggers of the same operation must be ignored | login, register (double submit) |
| `switchMap`  | only the latest result matters                          | load current user               |
| `concatMap`  | operations must be serialized                           | —                               |
| `mergeMap`   | operations can genuinely run in parallel                | —                               |

- Effects depend on **ports** (`AUTH_REPOSITORY`, `AUTH_SESSION_STORAGE`), never on `HttpClient`,
  `localStorage` or concrete implementations.
- Separate effects stay independent streams; never introduce a global lock between them.
- Handle races explicitly: cancel stale requests (`takeUntil(logout | expired)`) and let reducers
  validate that a late response is still relevant before applying it.
- Side-effect-only effects use `{ functional: true, dispatch: false }`.
- Reducers are pure: no HTTP, storage, routing, injection or dispatch.
