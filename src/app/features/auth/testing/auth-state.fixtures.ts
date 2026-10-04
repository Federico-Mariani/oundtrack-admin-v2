import { AUTH_FEATURE_KEY } from '../application/state/auth.feature';
import { type AuthState, initialAuthState } from '../application/state/auth.state';

export interface AuthRootState {
  readonly [AUTH_FEATURE_KEY]: AuthState;
}

/** Root store state containing only the Auth slice, for selector and facade tests. */
export function authRootState(overrides: Partial<AuthState> = {}): AuthRootState {
  return { [AUTH_FEATURE_KEY]: { ...initialAuthState, ...overrides } };
}
