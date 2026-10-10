import type { RequestState } from '@shared/state/request/request-state';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { AuthSession } from '../../domain/models/auth-session';
import type { User } from '../../domain/models/user';
import type {RequestError} from "@shared/state/request/request-error";

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
  readonly loginRequest: RequestState<RequestError>;
  readonly registrationRequest: RequestState<RequestError>;
  readonly sessionRestoreRequest: RequestState<RequestError>;
  readonly currentUserRequest: RequestState<RequestError>;
}

export const initialAuthState: AuthState = {
  session: null,
  user: null,
  loginRequest: idleRequest(),
  registrationRequest: idleRequest(),
  sessionRestoreRequest: idleRequest(),
  currentUserRequest: idleRequest(),
};
