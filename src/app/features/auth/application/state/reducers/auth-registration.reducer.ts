import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import {
  AuthRegistrationActions,
  AuthRegistrationApiActions,
} from '../actions/auth-registration.actions';
import type { AuthState } from '../auth.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

/** Registration lifecycle: the new account is signed in right away, like login. */
export const authRegistrationReducers: ReducerTypes<AuthState, readonly ActionCreator[]>[] = [
  on(AuthRegistrationActions.requested, (state): AuthState => ({
    ...state,
    registrationRequest: pendingRequest(),
  })),
  on(AuthRegistrationApiActions.succeeded, (state, { session }): AuthState => ({
    ...state,
    session,
    registrationRequest: succeededRequest(),
  })),
  on(AuthRegistrationApiActions.failed, (state, { error }): AuthState => ({
    ...state,
    registrationRequest: failedRequest(error),
  })),
];
