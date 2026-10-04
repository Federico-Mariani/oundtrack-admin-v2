import type { RequestState } from '@shared/state/request/request-state';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { AuthError } from '../../domain/errors/auth-error';
import type { AuthSession } from '../../domain/models/auth-session';
import type { User } from '../../domain/models/user';

/**
 * Source state of the Auth feature.
 * Everything else (`isAuthenticated`, `accessToken`, loading flags, ...) is
 * derived by selectors. Each async operation tracks its own lifecycle so
 * independent requests (e.g. loading the user while another request is in
 * flight) can be pending at the same time.
 */
export interface AuthState {
  readonly session: AuthSession | null;
  readonly user: User | null;
  readonly loginRequest: RequestState<AuthError>;
  readonly registrationRequest: RequestState<AuthError>;
  readonly sessionRestoreRequest: RequestState<AuthError>;
  readonly currentUserRequest: RequestState<AuthError>;
}

export const initialAuthState: AuthState = {
  session: null,
  user: null,
  loginRequest: idleRequest(),
  registrationRequest: idleRequest(),
  sessionRestoreRequest: idleRequest(),
  currentUserRequest: idleRequest(),
};
