import { authError, TEST_USER, validSession } from '../../../testing/auth.fixtures';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { authReducer } from '../auth.reducer';
import { type AuthState, initialAuthState } from '../auth.state';
import { failedRequest, pendingRequest } from '@shared/state/request/request-state.transitions';

describe('authLogoutReducers', () => {
  it('resets the whole auth slice, including in-flight and failed requests', () => {
    const authenticated: AuthState = {
      ...initialAuthState,
      session: validSession(),
      user: TEST_USER,
      currentUserRequest: pendingRequest(),
      loginRequest: failedRequest(authError('unknown')),
    };

    const state = authReducer(authenticated, AuthLogoutActions.requested());

    expect(state).toEqual(initialAuthState);
  });
});
