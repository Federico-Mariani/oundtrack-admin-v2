import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { AuthSessionActions } from '../actions/auth-session.actions';
import type { AuthState } from '../auth.state';
import { pendingRequest, succeededRequest } from '@shared/state/request/request-state.transitions';
import { AuthSessionStorageActions } from '../actions/auth-session-storage.actions';

/**
 * Session lifecycle: rehydration at startup and server-side invalidation.
 * Finding no persisted session is a completed restore, not a failure.
 */
export const authSessionReducers: ReducerTypes<AuthState, readonly ActionCreator[]>[] = [
  on(AuthSessionActions.sessionRestoreRequested, (state): AuthState => ({
    ...state,
    sessionRestoreRequest: pendingRequest(),
  })),
  on(AuthSessionStorageActions.sessionRestored, (state, { session }): AuthState => ({
    ...state,
    session,
    sessionRestoreRequest: succeededRequest(),
  })),
  on(AuthSessionStorageActions.sessionNotFound, (state): AuthState => ({
    ...state,
    sessionRestoreRequest: succeededRequest(),
  })),
  on(AuthSessionActions.sessionExpired, (state): AuthState => ({
    ...state,
    session: null,
    user: null,
  })),
];
