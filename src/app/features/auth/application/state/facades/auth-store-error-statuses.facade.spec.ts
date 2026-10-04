import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authRootState, type AuthRootState } from '../../../testing/auth-state.fixtures';
import { authError } from '../../../testing/auth.fixtures';
import { failedRequest } from '@shared/state/request/request-state.transitions';
import { AuthStoreErrorStatusesFacade } from './auth-store-error-statuses.facade';

describe('AuthStoreErrorStatusesFacade', () => {
  let facade: AuthStoreErrorStatusesFacade;
  let store: MockStore<AuthRootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: authRootState() })],
    });

    facade = TestBed.inject(AuthStoreErrorStatusesFacade);
    store = TestBed.inject<MockStore<AuthRootState>>(MockStore);
  });

  it('exposes one error per operation so they can coexist', () => {
    const loginError = authError('invalid-credentials');
    const registrationError = authError('email-already-registered');

    expect(facade.login()).toBeNull();

    store.setState(
      authRootState({
        loginRequest: failedRequest(loginError),
        registrationRequest: failedRequest(registrationError),
      }),
    );

    expect(facade.login()).toEqual(loginError);
    expect(facade.registration()).toEqual(registrationError);
    expect(facade.sessionRestore()).toBeNull();
    expect(facade.currentUser()).toBeNull();
  });
});
