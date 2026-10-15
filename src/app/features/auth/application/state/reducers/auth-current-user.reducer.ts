import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthCurrentUserActions } from '../actions/auth-current-user.actions';
import type { AuthState } from '../auth.state';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { AuthCurrentUserApiActions } from '../actions/api/auth-current-user-api.actions';

/**
 * Current-user lifecycle. A user that arrives when no session exists anymore
 * (response outlived a logout) is discarded, so the store never shows a
 * profile for a terminated session.
 */
export const authUserReducers: Array<ReducerTypes<AuthState, ReadonlyArray<ActionCreator>>> = [
  on(AuthCurrentUserActions.currentUserLoadRequested, (state): AuthState => ({
    ...state,
    currentUserRequest: pendingRequest(),
  })),
  on(AuthCurrentUserApiActions.currentUserLoaded, (state, { user }): AuthState =>
    state.session
      ? { ...state, user, currentUserRequest: succeededRequest() }
      : { ...state, currentUserRequest: idleRequest() },
  ),
  on(AuthCurrentUserApiActions.currentUserLoadFailed, (state, { error }): AuthState => ({
    ...state,
    currentUserRequest: failedRequest(error),
  })),
];
