# NgRx rules

Use the NgRx Global Store with standalone APIs, functional effects and feature-local facades.
The request action factories and requests facades introduced in the current codebase are the
standard for new and migrated operations. Do not restore the old loading/error facade split.

## Files and responsibilities

Paths below are relative to `src/app/` unless stated otherwise.

| Concern           | Location                                                                         | Contract                                                                              |
| ----------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Feature identity  | `features/<feature>/application/state/<feature>-state-definition.ts`             | Pure feature-local constant containing the existing store key and action source       |
| Operation names   | `features/<feature>/application/state/<feature>-request-operation.ts`            | Feature-local `as const` object and derived value type                                |
| State             | `features/<feature>/application/state/<feature>.state.ts`                        | Source data and one `RequestState<E>` per independent operation                       |
| Request actions   | `features/<feature>/application/state/actions/<feature>-<operation>.actions.ts`  | One factory result containing requested, reset, succeeded and failed                  |
| Request factories | `shared/state/ngrx/create-request-actions.ts`                                    | `createRequestActions` and `createEmptyRequestActions`                                |
| Micro-reducers    | `features/<feature>/application/state/reducers/<feature>-<operation>.reducer.ts` | Arrays of `on()` handlers using shared transitions                                    |
| Root reducer      | `features/<feature>/application/state/<feature>.reducer.ts`                      | `createReducer(initialState, ...microReducers)` composition only                      |
| Feature           | `features/<feature>/application/state/<feature>.feature.ts`                      | `createFeature`, generated selectors and business-derived selectors                   |
| Effects           | `features/<feature>/application/state/effects/<feature>-<operation>.effects.ts`  | Functional effects depending on application ports                                     |
| Facades           | `features/<feature>/application/state/facades/*.facade.ts`                       | Data, requests, actions and their composition facade                                  |
| Registration      | `features/<feature>/<feature>.providers.ts`                                      | `provideState` and `provideEffects`; root Store is registered once in `app.config.ts` |

## Feature identity and operation names

Define each feature's identity once in a dependency-free state definition file. Both
`createFeature` and action definitions import that file; actions must never import the
feature object to obtain its name, because feature → reducer → actions creates a cycle.
Do not introduce a shared registry of concrete feature names.

Target definition in `features/auth/application/state/auth-state-definition.ts`:

```ts
export const AUTH_STATE_DEFINITION = {
  key: 'auth',
  source: 'Auth',
} as const;
```

The key is the stable persisted/registered store identifier; source is the stable DevTools
label. They have different purposes but one owner. Preserve existing values when migrating.
`createFeature` uses `AUTH_STATE_DEFINITION.key`. Existing exported key constants, if needed
for compatibility, must derive from this definition rather than repeat the literal.

Target operation definition in `features/auth/application/state/auth-request-operation.ts`:

```ts
export const AuthRequestOperation = {
  CurrentUser: 'Get Current User',
} as const;

export type AuthRequestOperation = (typeof AuthRequestOperation)[keyof typeof AuthRequestOperation];
```

Add other actual Auth operations to the same operation object, preserving their current labels.
Every feature follows this naming and placement convention. Do not create a global operation
registry that couples unrelated features. Reuse an operation constant for the same operation;
never duplicate its literal across actions, effects or other state files.

Target action definition in `features/auth/application/state/actions/auth-current-user.actions.ts`:

```ts
import { createEmptyRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { UserModel } from '../../../domain/models/user.model';
import { AUTH_STATE_DEFINITION } from '../auth-state-definition';
import { AuthRequestOperation } from '../auth-request-operation';

export const AuthCurrentUserActions = createEmptyRequestActions<
  { readonly user: UserModel },
  { readonly error: RequestError }
>(AUTH_STATE_DEFINITION.source, AuthRequestOperation.CurrentUser);
```

These identity/operation files describe the target convention; this rules change does not
claim that the existing action call sites have already been migrated.

## Request action lifecycle

- Use `createRequestActions<Requested, Succeeded, Failed>` when requested has a payload.
- Use `createEmptyRequestActions<Succeeded, Failed>` when requested has no payload.
- Use the returned `requested`, `reset`, `succeeded`, `failed` creators throughout reducers,
  effects and action facades. Do not keep parallel API action groups for the same operation.
- Factory failure payloads include `error: RequestError`; include correlation fields where
  necessary. Never weaken payloads to `any` or silence mismatches with assertions.
- Lifecycle labels and source formatting belong to the shared factory only. Preserve
  `[Auth Get Current User] Requested` and `[Auth Get Current User API] Succeeded` formatting.
- `createActionGroup` remains appropriate for non-request events such as session expiration.
  Its source must also derive from the feature definition and named capability constants.
- Compare action types with the corresponding creator's `.type`, never a handwritten string.
  Prefer separate `ofType` pipelines when action unions do not narrow safely. Do not cast a
  payload to compensate for the factories' broad `ActionCreator<string, ...>` return types.
- Keep operation names unique within a feature so two creators cannot share an action type.

## Request state and typed values

Every independent operation owns a `RequestState<E>`; errors and pending states must not
interfere with another operation. Retain explicit error types (`RequestState<never>` is valid
for infallible state operations, but is not the current request factory's failure contract).

Existing primitives under `shared/state/request/`:

- `request-state.ts`: request state contract.
- `request-status.ts`: lifecycle values and their type.
- `request-state.transitions.ts`: `idleRequest`, `pendingRequest`, `succeededRequest`, `failedRequest`.
- `request-state.queries.ts`: pure request queries, including `isRequestPending` and `requestError`.

Reducers use the transition functions, never inline request state objects. A reset restores
only the relevant lifecycle to idle; clearing domain data is an explicit operation decision.
Do not replace the current explicit reducers with a generic reducer framework.

For finite lifecycle values, the target convention is a runtime object plus its derived union
in `shared/state/request/request-status.ts`:

```ts
export const RequestStatus = {
  Idle: 'idle',
  Pending: 'pending',
  Success: 'success',
  Error: 'error',
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];
```

Use `RequestStatus.Pending`, not `'pending'`, in transitions, queries, signal projections and
any necessary comparisons. Prefer semantic queries or request signals at consumers.
Keep the serialized values unchanged. This is the target convention for the current union;
introduce the runtime definition before migrating its consumers.

Apply the same principle to error codes and other finite domain discriminants: one named
runtime definition, a derived type and named members at use sites. Put domain values in their
owning feature's domain and domain-neutral values in pure shared files. Do not move feature
concepts into shared to avoid an import restriction. Parse and validate external strings at
infrastructure boundaries; constants do not replace runtime validation.

## Requests facade and presentation

`shared/state/store-facade.ts` composes exactly `data`, `requests`, `actions` through
`StoreFacade<DATA, REQUESTS, ACTIONS>` and provider tokens.

- `<feature>-store-data.facade.ts` exposes selected business data only.
- `<feature>-store-requests.facade.ts` selects each generated request-state selector and wraps
  it once with `createRequestSignals` from `shared/state/request-signals.ts`.
- `<feature>-store-actions.facade.ts` is the dispatch entry point and exposes intent methods.
- `<feature>.facade.ts` composes those three facades. Do not duplicate request state locally.

`RequestSignals<E>` exposes `status`, `isIdle`, `isLoading`, `isSuccess`, `isError`, `error` as
signals. Its `computed` projections are allowed shared presentation-neutral projections;
feature facades must not reimplement them or derive business state with `computed`.

Presentation example using the current Auth requests facade:

```ts
private readonly auth = inject(AuthFacade);
readonly user = this.auth.data.user;
readonly isLoggingIn = this.auth.requests.login.isLoading;
readonly loginError = this.auth.requests.login.error;
```

Do not introduce `XStoreLoadingStatusesFacade`, `XStoreErrorStatusesFacade`, separate
`loadingStatuses`/`errorStatuses` properties, or per-operation loading/error/success selectors
that merely duplicate `createRequestSignals`. Keep actual business-derived selectors in
`extraSelectors`. Never duplicate selectors already generated by `createFeature`.

## Effects, feedback and concurrency

Choose concurrency from operation semantics, and explain non-obvious choices in the PR:

| Operator     | Meaning                                | Typical use                      |
| ------------ | -------------------------------------- | -------------------------------- |
| `exhaustMap` | Ignore repeated triggers while pending | Login or form submission         |
| `switchMap`  | Keep the latest request                | Detail lookup or search          |
| `concatMap`  | Serialize operations                   | Ordered writes                   |
| `mergeMap`   | Permit independent concurrent work     | Separately correlated operations |

- Effects are functional, with `inject()` default parameters, and depend on application ports.
- Catch errors inside the inner observable and emit the operation's `failed` action, so the
  effect remains alive. Feedback effects use `{ functional: true, dispatch: false }` and ports.
- Do not compare literal action strings in feedback effects. Keep notifications and navigation
  separate from domain state transitions; application state remains translation-agnostic.
- Cancellation (`reset`, owner close, logout, expiration) must match the operation lifecycle.
  The current factory reset has no payload: do not assume an ID is present on reset. If an
  operation needs per-owner cancellation, define an explicit typed event for that requirement.
- Cancel outdated effects and reject stale successes AND failures in reducers using the
  relevant ID/generation. Cancellation alone does not guarantee that late results are safe.
- Effects and reducers must agree about ignored duplicate requests: an `exhaustMap` write
  must not allow a second request to replace the active target while the first is pending.
- Independent operations may run concurrently. Never introduce a global loading/error lock.
- Reducers are pure; no injection, I/O, routing, notifications or dispatch.

## Boundaries and forbidden patterns

- No SignalStore, class-based actions, `enum ActionTypes`, handwritten action type strings,
  `switch (action.type)`, legacy Store/Effects modules or `createFeatureSelector`.
- Presentation consumes facades only: no Store, feature objects or actions.
- Feature state cannot import another feature's state or facade, even through its public API.
  Collaborate through ports or app-level composition, never a global event bus.
- Shared NgRx factories belong only in `shared/state/ngrx/`, the existing narrow ESLint
  exception. They must remain feature-agnostic. `shared/state/request/` stays pure TypeScript;
  `shared/state/request-signals.ts` may use Angular signals, not NgRx.
- Infrastructure consumes state through an application port bound in feature providers,
  never through Store or a facade.

## Applying the convention

1. Inspect the feature's current operation names, state keys and request semantics.
2. Introduce its dependency-free identity and operation definitions; preserve existing values.
3. Replace repeated identity/operation literals in actions and feature registration.
4. Add runtime definitions for finite statuses/codes and migrate comparisons and transitions.
5. Use request factories for async actions; update every reducer, effect, feedback effect and
   action facade together. Keep custom cancellation/correlation semantics intact.
6. Expose requests through `XStoreRequestsFacade` and migrate presentation consumers.
7. Remove obsolete request selectors, loading/error facades and duplicated API action groups.
8. Verify lifecycle, errors, reset, concurrency and stale-result behavior, then run the quality
   gates required by `.junie/rules/quality-gates.md`.

Do not describe a documentation convention as an already completed runtime migration or an
ESLint-enforced rule unless the implementation/configuration actually enforces it.
