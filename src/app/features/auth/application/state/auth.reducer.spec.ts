import type { Action } from '@ngrx/store';
import { authError, TEST_CREDENTIALS, TEST_USER, validSession } from '../../testing/auth.fixtures';
import { AuthLoginActions, AuthLoginApiActions } from './actions/auth-login.actions';
import { AuthSessionActions, AuthSessionStorageActions } from './actions/auth-session.actions';
import { AuthUserActions, AuthUserApiActions } from './actions/auth-user.actions';
import { authReducer } from './auth.reducer';
import { type AuthState, initialAuthState } from './auth.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

const reduceAll = (actions: readonly Action[], from: AuthState = initialAuthState): AuthState =>
  actions.reduce(authReducer, from);

describe('authReducer (request independence)', () => {
  it('returns the initial state for unknown actions', () => {
    expect(authReducer(undefined, { type: '@@init' })).toEqual(initialAuthState);
  });

  it('lets a second operation start while another one is pending', () => {
    const state = reduceAll([
      AuthSessionActions.restoreRequested(),
      AuthUserActions.loadRequested(),
    ]);

    expect(state.sessionRestoreRequest).toEqual(pendingRequest());
    expect(state.currentUserRequest).toEqual(pendingRequest());
  });

  it('keeps an operation pending when an independent one succeeds', () => {
    const state = reduceAll([
      AuthUserActions.loadRequested(),
      AuthSessionActions.restoreRequested(),
      AuthSessionStorageActions.restoreSucceeded({ session: validSession() }),
    ]);

    expect(state.sessionRestoreRequest).toEqual(succeededRequest());
    expect(state.currentUserRequest).toEqual(pendingRequest());
  });

  it('never lets the error of one operation overwrite another one', () => {
    const userError = authError('network');
    const state = reduceAll([
      AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }),
      AuthLoginApiActions.succeeded({ session: validSession() }),
      AuthUserActions.loadRequested(),
      AuthUserApiActions.loadFailed({ error: userError }),
    ]);

    expect(state.loginRequest).toEqual(succeededRequest());
    expect(state.currentUserRequest).toEqual(failedRequest(userError));
  });

  it('completes the full login â†’ user flow', () => {
    const session = validSession();
    const state = reduceAll([
      AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }),
      AuthLoginApiActions.succeeded({ session }),
      AuthUserActions.loadRequested(),
      AuthUserApiActions.loadSucceeded({ user: TEST_USER }),
    ]);

    expect(state).toEqual({
      ...initialAuthState,
      session,
      user: TEST_USER,
      loginRequest: succeededRequest(),
      currentUserRequest: succeededRequest(),
    });
  });
});
