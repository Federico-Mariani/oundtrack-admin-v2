import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthRefreshActions } from '../actions/auth-refresh.actions';
import type { AuthState } from '../auth.state';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { AuthLoginActions } from '../actions/auth-login.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthSessionStorageActions } from '../actions/auth-session-storage.actions';

export const authRefreshReducers: Array<ReducerTypes<AuthState, ReadonlyArray<ActionCreator>>> = [
  on(
    AuthLoginActions.requested,
    AuthLoginActions.succeeded,
    AuthLogoutActions.logoutSubmitted,
    AuthSessionActions.sessionExpired,
    AuthSessionStorageActions.sessionRestored,
    (state): AuthState => ({
      ...state,
      generation: state.generation + 1,
      refreshRequest: idleRequest(),
    }),
  ),
  on(AuthRefreshActions.requested, (state, { generation }): AuthState =>
    state.generation === generation && state.session
      ? { ...state, refreshRequest: pendingRequest() }
      : state,
  ),
  on(AuthRefreshActions.succeeded, (state, { generation, session }): AuthState =>
    state.generation === generation && state.session
      ? { ...state, session, refreshRequest: succeededRequest() }
      : state,
  ),
  on(AuthRefreshActions.failed, (state, { generation, error }): AuthState =>
    state.generation === generation && state.session
      ? { ...state, refreshRequest: failedRequest(error) }
      : state,
  ),
];
