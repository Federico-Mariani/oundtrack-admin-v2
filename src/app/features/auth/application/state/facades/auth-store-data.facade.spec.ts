import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { authRootState, type AuthRootState } from '../../../testing/auth-state.fixtures';
import { TEST_USER, validSession } from '../../../testing/auth.fixtures';
import { AuthStoreDataFacade } from './auth-store-data.facade';

describe('AuthStoreDataFacade', () => {
  let facade: AuthStoreDataFacade;
  let store: MockStore<AuthRootState>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState: authRootState() })],
    });

    facade = TestBed.inject(AuthStoreDataFacade);
    store = TestBed.inject<MockStore<AuthRootState>>(MockStore);
  });

  it('reflects the anonymous state', () => {
    expect(facade.session()).toBeNull();
    expect(facade.user()).toBeNull();
    expect(facade.isAuthenticated()).toBe(false);
    expect(facade.accessToken()).toBeNull();
    expect(facade.userFullName()).toBeNull();
  });

  it('exposes store changes through signals', () => {
    const session = validSession();

    store.setState(authRootState({ session, user: TEST_USER }));

    expect(facade.session()).toEqual(session);
    expect(facade.user()).toEqual(TEST_USER);
    expect(facade.isAuthenticated()).toBe(true);
    expect(facade.accessToken()).toBe(session.accessToken);
    expect(facade.userFullName()).toBe('Ada Lovelace');
  });
});
