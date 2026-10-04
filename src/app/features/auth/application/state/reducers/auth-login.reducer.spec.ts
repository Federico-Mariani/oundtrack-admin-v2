import { authError, TEST_CREDENTIALS, validSession } from '../../../testing/auth.fixtures';
import { AuthLoginActions, AuthLoginApiActions } from '../actions/auth-login.actions';
import { authReducer } from '../auth.reducer';
import { initialAuthState } from '../auth.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

describe('authLoginReducers', () => {
  it('marks login as pending on request', () => {
    const state = authReducer(
      initialAuthState,
      AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }),
    );

    expect(state.loginRequest).toEqual(pendingRequest());
    expect(state.session).toBeNull();
  });

  it('stores the session on success', () => {
    const session = validSession();
    const state = authReducer(initialAuthState, AuthLoginApiActions.succeeded({ session }));

    expect(state.session).toEqual(session);
    expect(state.loginRequest).toEqual(succeededRequest());
  });

  it('keeps the error on failure without touching the session', () => {
    const error = authError('invalid-credentials');
    const state = authReducer(initialAuthState, AuthLoginApiActions.failed({ error }));

    expect(state.loginRequest).toEqual(failedRequest(error));
    expect(state.session).toBeNull();
  });

  it('clears a previous login error when a new attempt starts', () => {
    const failed = authReducer(
      initialAuthState,
      AuthLoginApiActions.failed({ error: authError('invalid-credentials') }),
    );
    const retried = authReducer(
      failed,
      AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }),
    );

    expect(retried.loginRequest.error).toBeNull();
  });
});
