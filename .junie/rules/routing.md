# Routing rules

Routing is **feature-owned**. Each bounded context owns its paths, navigation commands, navigation
service, routes and guards; `app.routes.ts` only composes feature public routing APIs. There is no
global route config, no global route registry and no global God `RouterService`. These rules are
enforced by the existing architecture boundaries (routing lives in `presentation/`, so it is the
`feature-presentation` element) and by convention where ESLint cannot check intent. Keep this file,
`architecture.md` and `eslint/*.mjs` in sync.

## Where routing lives

A feature's routing lives in `presentation/routing/` (a presentation concern because it depends on
the Angular `Router`). Create only the files the feature actually needs:

```text
features/<feature>/presentation/routing/
├── guards/
│   └── <feature>.guards.ts            # functional guards, close to the routes they protect
├── <feature>.paths.ts                 # route segments + param/query keys (single source of truth)
├── <feature>.navigation.ts            # pure typed navigation commands derived from paths
├── <feature>-navigation.service.ts    # imperative navigation, encapsulates the Router
└── <feature>.routes.ts                # the feature Routes (lazy pages)
```

Feature complexity decides the files: a one-route feature (e.g. Home) may only need
`<feature>.routes.ts`. Do not create `params`, `query-params`, a navigation service or guards when
the feature does not need them. The convention only says **where** each concern goes when it exists.

## Paths — one source of truth

```ts
export const AUTH_PATHS = {
  login: 'login',
} as const;

/** Query-parameter carrying the URL to return to after a successful login. */
export const RETURN_URL_QUERY_PARAM = 'returnUrl';
```

- Paths are route **segments**, never full URLs and never duplicated across files.
- Dynamic segments derive from typed param keys:
  `export const ORDER_ROUTE_PARAMS = { orderId: 'orderId' } as const;` then
  `details: \`:${ORDER_ROUTE_PARAMS.orderId}\``. No magic strings (`'orderId'`) scattered around.
- Feature-specific query params get a small dedicated constant/structure only when actually useful;
  no global `router-query-params` interface.

## Navigation commands — pure and typed

```ts
import { AUTH_PATHS } from './auth.paths';

export const AUTH_NAVIGATION = {
  login: () => ['/', AUTH_PATHS.login] as const,
} as const;
```

- Pure, framework-light (no Angular injection), derived only from the paths.
- Use the most precise type available, not `string`: `details: (orderId: Id) => ['/', ORDER_PATHS.root, orderId] as const`.
- These commands back both the navigation service and `routerLink` bindings; they are the single
  derived representation of a destination — do not keep `nav` + `url` + `path` as three sources.

## Navigation service — encapsulates the Router

```ts
@Injectable({ providedIn: 'root' })
export class MoviesNavigationService {
  private readonly router = inject(Router);

  goToLogin(extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([...AUTH_NAVIGATION.login()], extras);
  }

  loginRedirect(returnUrl?: string): UrlTree {
    return this.router.createUrlTree(
      [...AUTH_NAVIGATION.login()],
      returnUrl ? { queryParams: { [RETURN_URL_QUERY_PARAM]: returnUrl } } : {},
    );
  }
}
```

- One imperative-navigation abstraction per feature: `FeatureNavigationService`. Do not create
  parallel `FeatureRouter` / `FeatureRouteService` / `FeatureRoutingFacade` doing the same thing.
- It hides the Router from consumers, exposes semantically clear methods, accepts `NavigationExtras`
  and can build URLs via `createUrlTree` / `serializeUrl`. It contains **no** business logic.
- It must **not** know the Store, actions or `moviesFeature`. Navigation decisions that need state are
  taken by the consumer / guard / orchestrator.
- `inject()` only, `private readonly`, no constructor injection.
- Return the Router's `Promise<boolean>` / a `UrlTree`; never swallow it (`void this.router.navigate(...)`
  inside the service) and never hide errors with `.catch(() => {})`. The caller chooses `await` or `void`.
- Separate from the facade: `AuthFacade` does state/application operations (`login()`),
  `GameCategoriesNavigationService` does navigation (`goToLogin()`). Do not mix both in one class.

## Routes — lazy and feature-local

```ts
export const AUTH_ROUTES: Routes = [
  {
    path: AUTH_PATHS.login,
    canActivate: [guestGuard],
    loadComponent: () => import('../pages/login/login-page').then((m) => m.CreateOneMoviePage),
  },
];
```

- Lazy-load pages (`loadComponent` / `loadChildren`) unless there is a real reason to eager-load.
- Keep route `data` / `title` / `resolve` next to the route definition; no global config.
- Specific routes before wildcard; use `pathMatch: 'full'` where needed.
- Feature-internal redirects live in the feature routes; app-level redirects (`'' → home`) and the
  `**` fallback live in `app.routes.ts`.
- Route-scoped `providers: [...]` only when a dependency must live in that route/subtree's lifetime.
  Application-wide state (e.g. Auth, used by the interceptor, guards and several features) stays in
  the app composition root — never moved under a lazy route just to make it lazy.

## Guards

```ts
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthFacade);
  const navigation = inject(MoviesNavigationService);
  return auth.data.isAuthenticated() ? true : navigation.loginRedirect(state.url);
};
```

- Functional guards (`CanActivateFn` / `CanMatchFn`) in `routing/guards/`, close to the routes.
- Prefer returning a `UrlTree` (or `RedirectCommand`) to describe a redirect instead of an imperative
  `router.navigate(...)` + `return false`.
- Guards consume the feature facade only — never `Store`, actions or `moviesFeature` internals. They
  control access/navigation; they are not business services.

## `app.routes.ts` — composition only

```ts
export const routes: Routes = [
  { path: '', loadChildren: () => import('@features/auth').then((f) => f.AUTH_ROUTES) },
  { path: '', loadChildren: () => import('@features/home').then((f) => f.HOME_ROUTES) },
  { path: '**', redirectTo: '' },
];
```

- Only macro composition of feature public routing APIs, app-level redirects and the `**` fallback.
- Never import feature internals (pages, guards, paths). It knows only `@features/<feature>`.
- `**` is a matcher/wildcard, not a navigable URL: never expose it as a navigation command. A real
  error page (`forbidden`, `not-found`) gets a real path and, if needed, a navigation helper.

## Cross-feature navigation

- Presentation of feature A may navigate to feature B through B's public API (`import { AuthNavigationService } from '@features/auth'`). This is a legitimate
  `Presentation A → Public API B` boundary.
- Feature **application state** (reducers/effects/actions/facades) must never import another feature's
  navigation service, facade or store — the existing `feature-application-state` / `feature-facade`
  boundaries forbid it.
- Expose a `FeatureNavigationService` / `FEATURE_PATHS` from `index.ts` only when another boundary
  really consumes it.

## Declarative vs imperative

- Templates: prefer `routerLink` / `routerLinkActive`; do not replace anchors with click handlers.
  `routerLink` may be fed by a navigation command (`readonly loginLink = AUTH_NAVIGATION.login()`).
- TypeScript: use the feature navigation service for imperative navigation instead of scattered
  `router.navigate([...])`.

## Angular router features

- Configure the router once in `app.config.ts` via `provideRouter(routes, ...)`. Enable
  `withComponentInputBinding()` / scroll features only when they bring a concrete benefit and fit the
  architecture; do not add a custom global title/scroll/analytics router service when `provideRouter`
  already solves it.
- Keep `ActivatedRoute` where a component genuinely needs the route tree / data stream / complex
  param composition; do not convert for fashion.

## Do not build premature abstractions

No `BaseNavigationService`, `GenericRouter`, `RouteBuilder`, `NavigationFactory`,
`RouteDefinition<T>` or `new FeatureRouter(router)`. Sharing `Router.navigate()` is acceptable
syntactic duplication; extract a shared routing abstraction only when real common behaviour emerges,
and use Angular DI for navigation services.

## Testing routing

Test **our** logic, not Angular Router internals:

- Navigation services: `provideRouter([])`, assert the produced navigation command and extras (spy on `router.navigate`) and generated URLs (`router.serializeUrl(urlTree)`).
- Guards: fake the feature facade (no `provideMockStore` in presentation specs), assert the returned
  `boolean` / `UrlTree` for authenticated vs anonymous, including the `returnUrl` behaviour.
- Dynamic navigation: assert that route params (`orderId`, ...) land correctly in the commands/URL.
- Trivial constant paths (`login: 'login'`) do not need a dedicated test.
