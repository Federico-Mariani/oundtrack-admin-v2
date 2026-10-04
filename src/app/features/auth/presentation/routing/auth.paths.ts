/**
 * Route segments owned by the Auth feature. Single source of truth: every other
 * representation (routes, navigation commands, guards) derives from these.
 */
export const AUTH_PATHS = {
  login: 'login',
} as const;

/** Query-parameter carrying the URL to return to after a successful login. */
export const RETURN_URL_QUERY_PARAM = 'returnUrl';
