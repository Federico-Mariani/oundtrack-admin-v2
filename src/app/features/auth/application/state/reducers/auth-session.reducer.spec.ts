import { TEST_USER, validSession } from '../../../testing/auth.fixtures';
import { AuthSessionActions, AuthSessionStorageActions } from '../actions/auth-session.actions';
import { authReducer } from '../auth.reducer';
import { type AuthState, initialAuthState } from '../auth.state';
import { pendingRequest, succeededRequest } from '@shared/state/request/request-state.transitions';

describe('authSessionReducers', () => {
  it('marks restore as pending on request', () => {
    const state = authReducer(initialAuthState, AuthSessionActions.restoreRequested());

    expect(state.sessionRestoreRequest).toEqual(pendingRequest());
  });

  it('rehydrates the session on restore success', () => {
    const session = validSession();
    const state = authReducer(
      initialAuthState,
      AuthSessionStorageActions.restoreSucceeded({ session }),
    );

    expect(state.session).toEqual(session);
    expect(state.sessionRestoreRequest).toEqual(succeededRequest());
  });

  it('completes the restore without a session when nothing usable was persisted', () => {
    const state = authReducer(initialAuthState, AuthSessionStorageActions.noSessionFound());

    expect(state.session).toBeNull();
    expect(state.sessionRestoreRequest).toEqual(succeededRequest());
  });

  it('drops session and user when the session expires, keeping request outcomes', () => {
    const authenticated: AuthState = {
      ...initialAuthState,
      session: validSession(),
      user: TEST_USER,
      loginRequest: succeededRequest(),
    };

    const state = authReducer(authenticated, AuthSessionActions.expired());

    expect(state.session).toBeNull();
    expect(state.user).toBeNull();
    expect(state.loginRequest).toEqual(succeededRequest());
  });
});
