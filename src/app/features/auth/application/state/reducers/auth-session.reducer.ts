import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthSessionActions, AuthSessionStorageActions } from '../actions/auth-session.actions';
import type { AuthState } from '../auth.state';
import { pendingRequest, succeededRequest } from '@shared/state/request/request-state.transitions';

/**
 * Session lifecycle: rehydration at startup and server-side invalidation.
 * Finding no persisted session is a completed restore, not a failure.
 */
export const authSessionReducers: ReducerTypes<AuthState, readonly ActionCreator[]>[] = [
  on(AuthSessionActions.restoreRequested, (state): AuthState => ({
    ...state,
    sessionRestoreRequest: pendingRequest(),
  })),
  on(AuthSessionStorageActions.restoreSucceeded, (state, { session }): AuthState => ({
    ...state,
    session,
    sessionRestoreRequest: succeededRequest(),
  })),
  on(AuthSessionStorageActions.noSessionFound, (state): AuthState => ({
    ...state,
    sessionRestoreRequest: succeededRequest(),
  })),
  on(AuthSessionActions.expired, (state): AuthState => ({ ...state, session: null, user: null })),
];
