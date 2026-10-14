import type { RequestState } from '@shared/state/request/request-state';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { AuthSessionModel } from '../../domain/models/auth-session.model';
import type { UserModel } from '../../domain/models/user.model';
import type { RequestError } from '@shared/state/request/request-error';

/**
 * Source state of the Auth feature.
 * Everything else (`isAuthenticated`, `accessToken`, loading flags, ...) is
 * derived by selectors. Each async operation tracks its own lifecycle so
 * independent requests (e.g. loading the user while another request is in
 * flight) can be pending at the same time.
 */
export interface AuthState {
  readonly generation: number;
  readonly refreshRequest: RequestState<RequestError>;
  readonly session: AuthSessionModel | null;
  readonly user: UserModel | null;
  readonly loginRequest: RequestState<RequestError>;
  readonly registrationRequest: RequestState<RequestError>;
  readonly sessionRestoreRequest: RequestState<RequestError>;
  readonly currentUserRequest: RequestState<RequestError>;
}

export const initialAuthState: AuthState = {
  generation: 0,
  refreshRequest: idleRequest(),
  session: null,
  user: null,
  loginRequest: idleRequest(),
  registrationRequest: idleRequest(),
  sessionRestoreRequest: idleRequest(),
  currentUserRequest: idleRequest(),
};
