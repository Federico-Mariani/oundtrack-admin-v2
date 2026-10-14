import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthRefreshActions } from '../actions/auth-refresh.actions';
import type { AuthState } from '../auth.state';
import {
  pendingRequest,
  succeededRequest,
  failedRequest,
  idleRequest,
} from '@shared/state/request/request-state.transitions';
import { AuthLoginActions } from '../actions/auth-login.actions';
import { AuthLoginApiActions } from '../actions/api/auth-login-api.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthSessionStorageActions } from '../actions/auth-session-storage.actions';

export const authRefreshReducers: ReducerTypes<AuthState, readonly ActionCreator[]>[] = [
  on(
    AuthLoginActions.loginSubmitted,
    AuthLoginApiActions.loginSucceeded,
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
