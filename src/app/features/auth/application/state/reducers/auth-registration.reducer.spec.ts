import { authError, TEST_REGISTRATION, validSession } from '../../../testing/auth.fixtures';
import {
  AuthRegistrationActions,
  AuthRegistrationApiActions,
} from '../actions/auth-registration.actions';
import { authReducer } from '../auth.reducer';
import { initialAuthState } from '../auth.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

describe('authRegistrationReducers', () => {
  it('marks registration as pending on request', () => {
    const state = authReducer(
      initialAuthState,
      AuthRegistrationActions.requested({ data: TEST_REGISTRATION }),
    );

    expect(state.registrationRequest).toEqual(pendingRequest());
  });

  it('signs the new account in by storing its session on success', () => {
    const session = validSession();
    const state = authReducer(initialAuthState, AuthRegistrationApiActions.succeeded({ session }));

    expect(state.session).toEqual(session);
    expect(state.registrationRequest).toEqual(succeededRequest());
  });

  it('keeps the error on failure', () => {
    const error = authError('email-already-registered');
    const state = authReducer(initialAuthState, AuthRegistrationApiActions.failed({ error }));

    expect(state.registrationRequest).toEqual(failedRequest(error));
    expect(state.session).toBeNull();
  });
});
