# Testing rules

Runner: Vitest through `ng test` (`npm test`), jsdom. Specs live next to the code they verify (`x.ts` → `x.spec.ts`). Feature-level fakes and fixtures live in `features/<feature>/testing/`
(`FakeAuthRepository`, `InMemoryAuthSessionStorage`, `auth.fixtures.ts`, `auth-state.fixtures.ts`).

## Test our code, not the framework

Do not test behaviour that belongs to NgRx or Angular (e.g. that `createFeature` generates
`selectUser`, that `Store.selectSignal` returns a Signal, that `inject()` resolves a token).
Test every piece of **our** logic, small and focused:

| What                   | How                                                                                                                                                                                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Domain logic           | pure unit tests, no TestBed (`auth-session.spec.ts`)                                                                                                                                                |
| Shared pure primitives | pure unit tests, no Angular/NgRx (`request-state.spec.ts`)                                                                                                                                          |
| Reducers               | `state + action → new state`, one capability per spec; plus a root-reducer spec for concurrency (independent requests pending together, errors not overwriting each other)                          |
| Extra selectors        | project a fixture state through `xFeature.selectDerived` (only derived selectors)                                                                                                                   |
| Effects                | call the functional effect with `of(action)` and fakes; assert emitted actions, port interactions, error branches, and the RxJS operator semantics (exhaustMap ignores re-entry, switchMap cancels) |
| Facades                | `provideMockStore` for data/loading/error facades (signal reflects state); spy on `dispatch` for the actions facade                                                                                 |
| Repositories           | `HttpTestingController`: request shape, DTO → domain mapping, error mapping                                                                                                                         |
| Mappers                | pure unit tests per mapper                                                                                                                                                                          |
| Storage adapters       | real `localStorage` of jsdom, shape validation, corrupted data                                                                                                                                      |
| Guards / interceptors  | fake the **port/facade** they consume; never `provideMockStore` in presentation specs                                                                                                               |
| Components             | TestBed with a fake facade (`{ provide: AuthFacade, useValue: … }`)                                                                                                                                 |
| Integration flow       | real `Store` + reducer + effects with fake ports (`auth-store.integration.spec.ts`): restore, login, 401, network error, logout race, parallel operations                                           |

## Mandatory scenarios for state features

- **Concurrency**: operation A pending + operation B requested → B starts; A pending + B success →
  A still pending; A error does not overwrite B.
- **Race conditions**: `load user → logout → late response` must not re-insert stale state.
- **Error handling**: every effect has a failure test producing the `Failed` action with the mapped
  domain error.
- **Session semantics**: network error on `/me` keeps the session; 401 expires it.

## Conventions

- Fakes implement the **port interface** (`TvSeriesRepositoryPort`, `AuthSessionStoragePort`) — never mock
  `HttpClient` inside application tests.
- Fixtures are functions returning fresh objects (`validSession()`, `authRootState()`), never
  shared mutable constants.
- Specs follow the same boundaries as production code (ESLint): they may import anything inside
  their own feature, `shared`, `core`, `environments` and other features' public API — never
  another feature's internals.
- Presentation specs must not import `@ngrx/*`: fake the facade.
- `explicit-module-boundary-types`, `no-non-null-assertion` and `unbound-method` are relaxed in
  `*.spec.ts`; everything else (no `any`, no unsafe access, import type, boundaries) applies.
- No `it.skip` / `xit` / commented-out tests to make a run green; fix or delete with a reason.
