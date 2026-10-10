import { MOVIES_PATHS } from './movies.paths';

/**
 * Typed navigation commands (Router `commands` arrays) for the Auth feature.
 * Pure and framework-light: no Angular injection, derived only from AUTH_PATHS.
 * Consumed by `AuthNavigationService` (imperative navigation) and may back
 * `routerLink` bindings in templates.
 */
export const MOVIES_NAVIGATION = {
  root: () => ['/', MOVIES_PATHS.root] as const,
} as const;
