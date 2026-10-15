import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthLoginActions } from '../actions/auth-login.actions';
import type { AuthState } from '../auth.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { AuthLoginApiActions } from '../actions/api/auth-login-api.actions';

/** Login lifecycle: only `loginRequest` and, on success, `session` change. */
export const authLoginReducers: Array<ReducerTypes<AuthState, ReadonlyArray<ActionCreator>>> = [
  on(AuthLoginActions.loginSubmitted, (state): AuthState => ({
    ...state,
    loginRequest: pendingRequest(),
  })),
  on(AuthLoginApiActions.loginSucceeded, (state, { session }): AuthState => ({
    ...state,
    session,
    loginRequest: succeededRequest(),
  })),
  on(AuthLoginApiActions.loginFailed, (state, { error }): AuthState => ({
    ...state,
    loginRequest: failedRequest(error),
  })),
];
