import { TestBed } from '@angular/core/testing';
import type { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import type { MockInstance } from 'vitest';
import { authRootState } from '../../../testing/auth-state.fixtures';
import { TEST_CREDENTIALS, TEST_REGISTRATION } from '../../../testing/auth.fixtures';
import { AuthLoginActions } from '../actions/auth-login.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthRegistrationActions } from '../actions/auth-registration.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthUserActions } from '../actions/auth-user.actions';
import { AuthStoreActionsFacade } from './auth-store-actions.facade';

describe('AuthStoreActionsFacade', () => {
  let facade: AuthStoreActionsFacade;
  let dispatch: MockInstance<Store['dispatch']>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: authRootState() })],
    });

    facade = TestBed.inject(AuthStoreActionsFacade);
    dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
  });

  it('dispatches the login intent', () => {
    facade.login(TEST_CREDENTIALS);

    expect(dispatch).toHaveBeenCalledWith(
      AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }),
    );
  });

  it('dispatches the registration intent', () => {
    facade.register(TEST_REGISTRATION);

    expect(dispatch).toHaveBeenCalledWith(
      AuthRegistrationActions.requested({ data: TEST_REGISTRATION }),
    );
  });

  it('dispatches session, user and logout intents', () => {
    facade.restoreSession();
    facade.reloadCurrentUser();
    facade.logout();

    expect(dispatch.mock.calls.map(([action]) => action)).toEqual([
      AuthSessionActions.restoreRequested(),
      AuthUserActions.loadRequested(),
      AuthLogoutActions.requested(),
    ]);
  });
});
