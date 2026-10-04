import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthLoginActions, AuthLoginApiActions } from '../actions/auth-login.actions';
import type { AuthState } from '../auth.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

/** Login lifecycle: only `loginRequest` and, on success, `session` change. */
export const authLoginReducers: ReducerTypes<AuthState, readonly ActionCreator[]>[] = [
  on(AuthLoginActions.requested, (state): AuthState => ({
    ...state,
    loginRequest: pendingRequest(),
  })),
  on(AuthLoginApiActions.succeeded, (state, { session }): AuthState => ({
    ...state,
    session,
    loginRequest: succeededRequest(),
  })),
  on(AuthLoginApiActions.failed, (state, { error }): AuthState => ({
    ...state,
    loginRequest: failedRequest(error),
  })),
];
