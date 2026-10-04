import { authError, TEST_USER, validSession } from '../../../testing/auth.fixtures';
import { AuthUserActions, AuthUserApiActions } from '../actions/auth-user.actions';
import { authReducer } from '../auth.reducer';
import { type AuthState, initialAuthState } from '../auth.state';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

describe('authUserReducers', () => {
  const withSession: AuthState = { ...initialAuthState, session: validSession() };

  it('marks the current-user load as pending on request', () => {
    const state = authReducer(withSession, AuthUserActions.loadRequested());

    expect(state.currentUserRequest).toEqual(pendingRequest());
  });

  it('stores the user when a session is active', () => {
    const state = authReducer(withSession, AuthUserApiActions.loadSucceeded({ user: TEST_USER }));

    expect(state.user).toEqual(TEST_USER);
    expect(state.currentUserRequest).toEqual(succeededRequest());
  });

  it('discards a user that arrives after the session was terminated', () => {
    const state = authReducer(
      { ...initialAuthState, currentUserRequest: pendingRequest() },
      AuthUserApiActions.loadSucceeded({ user: TEST_USER }),
    );

    expect(state.user).toBeNull();
    expect(state.currentUserRequest).toEqual(idleRequest());
  });

  it('keeps the error on failure without dropping the session', () => {
    const error = authError('network');
    const state = authReducer(withSession, AuthUserApiActions.loadFailed({ error }));

    expect(state.currentUserRequest).toEqual(failedRequest(error));
    expect(state.session).toEqual(withSession.session);
  });
});
