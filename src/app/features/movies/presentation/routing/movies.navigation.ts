import { MOVIES_PATHS } from './movies.paths';

/**
 * Typed navigation commands (Router `commands` arrays) for the Movies feature.
 * Pure and framework-light: no Angular injection, derived only from MOVIES_PATHS.
 * Consumed by `MoviesNavigationService` (imperative navigation) and may back
 * `routerLink` bindings in templates.
 */
export const MOVIES_NAVIGATION = {
  root: () => ['/', MOVIES_PATHS.root] as const,
  create: () => ['/', MOVIES_PATHS.root, MOVIES_PATHS.create] as const,
} as const;
