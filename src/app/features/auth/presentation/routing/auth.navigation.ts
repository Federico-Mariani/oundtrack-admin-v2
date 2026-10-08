import { AUTH_PATHS } from './auth.paths';

/**
 * Typed navigation commands (Router `commands` arrays) for the Auth feature.
 * Pure and framework-light: no Angular injection, derived only from AUTH_PATHS.
 * Consumed by `AuthNavigationService` (imperative navigation) and may back
 * `routerLink` bindings in templates.
 */
export const AUTH_NAVIGATION = {
  login: () => ['/', AUTH_PATHS.root, AUTH_PATHS.login] as const,
} as const;
