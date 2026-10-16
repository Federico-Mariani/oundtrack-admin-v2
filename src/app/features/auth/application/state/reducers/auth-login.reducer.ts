import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthLoginActions } from '../actions/auth-login.actions';
import type { AuthState } from '../auth.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

/** Login lifecycle: only `loginRequest` and, on success, `session` change. */
export const authLoginReducers: Array<ReducerTypes<AuthState, ReadonlyArray<ActionCreator>>> = [
  on(AuthLoginActions.requested, (state): AuthState => ({
    ...state,
    loginRequest: pendingRequest(),
  })),
  on(AuthLoginActions.succeeded, (state, { session }): AuthState => ({
    ...state,
    session,
    loginRequest: succeededRequest(),
  })),
  on(AuthLoginActions.failed, (state, { error }): AuthState => ({
    ...state,
    loginRequest: failedRequest(error),
  })),
];
