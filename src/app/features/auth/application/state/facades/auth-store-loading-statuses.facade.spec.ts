import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authRootState, type AuthRootState } from '../../../testing/auth-state.fixtures';
import { pendingRequest } from '@shared/state/request/request-state.transitions';
import { AuthStoreLoadingStatusesFacade } from './auth-store-loading-statuses.facade';

describe('AuthStoreLoadingStatusesFacade', () => {
  let facade: AuthStoreLoadingStatusesFacade;
  let store: MockStore<AuthRootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: authRootState() })],
    });

    facade = TestBed.inject(AuthStoreLoadingStatusesFacade);
    store = TestBed.inject<MockStore<AuthRootState>>(MockStore);
  });

  it('exposes one independent flag per operation', () => {
    expect(facade.isLoggingIn()).toBe(false);
    expect(facade.isLoadingCurrentUser()).toBe(false);

    store.setState(
      authRootState({ loginRequest: pendingRequest(), currentUserRequest: pendingRequest() }),
    );

    expect(facade.isLoggingIn()).toBe(true);
    expect(facade.isLoadingCurrentUser()).toBe(true);
    expect(facade.isRegistering()).toBe(false);
    expect(facade.isRestoringSession()).toBe(false);
  });
});
