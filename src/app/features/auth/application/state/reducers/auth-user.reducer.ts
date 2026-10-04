import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthUserActions, AuthUserApiActions } from '../actions/auth-user.actions';
import type { AuthState } from '../auth.state';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

/**
 * Current-user lifecycle. A user that arrives when no session exists anymore
 * (response outlived a logout) is discarded, so the store never shows a
 * profile for a terminated session.
 */
export const authUserReducers: ReducerTypes<AuthState, readonly ActionCreator[]>[] = [
  on(AuthUserActions.loadRequested, (state): AuthState => ({
    ...state,
    currentUserRequest: pendingRequest(),
  })),
  on(AuthUserApiActions.loadSucceeded, (state, { user }): AuthState =>
    state.session
      ? { ...state, user, currentUserRequest: succeededRequest() }
      : { ...state, currentUserRequest: idleRequest() },
  ),
  on(AuthUserApiActions.loadFailed, (state, { error }): AuthState => ({
    ...state,
    currentUserRequest: failedRequest(error),
  })),
];
