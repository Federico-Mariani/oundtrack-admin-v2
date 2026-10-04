import { TestBed } from '@angular/core/testing';
import { provideEffects } from '@ngrx/effects';
import { provideState, provideStore } from '@ngrx/store';
import { Subject } from 'rxjs';
import {
  authError,
  expiredSession,
  TEST_CREDENTIALS,
  TEST_USER,
  validSession,
} from '../../testing/auth.fixtures';
import { FakeAuthRepository } from '../../testing/fake-auth.repository';
import { InMemoryAuthSessionStorage } from '../../testing/in-memory-auth-session.storage';
import { AUTH_REPOSITORY } from '../tokens/auth-repository.token';
import { AUTH_SESSION_STORAGE } from '../tokens/auth-session-storage.token';
import { authFeature } from './auth.feature';
import * as authLoginEffects from './effects/auth-login.effects';
import * as authRegistrationEffects from './effects/auth-registration.effects';
import * as authSessionEffects from './effects/auth-session.effects';
import * as authUserEffects from './effects/auth-user.effects';
import { AuthFacade } from './facades/auth.facade';

/**
 * Wires the real Store, feature and effects with in-memory infrastructure
 * and drives the flows the way the UI does: through `AuthFacade` only.
 */
describe('Auth store integration', () => {
  let auth: AuthFacade;
  let repository: FakeAuthRepository;
  let storage: InMemoryAuthSessionStorage;

  beforeEach(() => {
    repository = new FakeAuthRepository();
    storage = new InMemoryAuthSessionStorage();

    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideState(authFeature),
        provideEffects(
          authSessionEffects,
          authLoginEffects,
          authRegistrationEffects,
          authUserEffects,
        ),
        { provide: AUTH_REPOSITORY, useValue: repository },
        { provide: AUTH_SESSION_STORAGE, useValue: storage },
      ],
    });

    auth = TestBed.inject(AuthFacade);
  });

  describe('session restore', () => {
    it('is settled synchronously and loads the user in the background', () => {
      const session = validSession();
      storage.session = session;

      auth.actions.restoreSession();

      expect(auth.data.isAuthenticated()).toBe(true);
      expect(auth.data.session()).toEqual(session);
      expect(auth.loadingStatuses.isRestoringSession()).toBe(false);
      expect(auth.loadingStatuses.isLoadingCurrentUser()).toBe(true);

      repository.currentUser$.next(TEST_USER);

      expect(auth.data.userFullName()).toBe('Ada Lovelace');
      expect(auth.loadingStatuses.isLoadingCurrentUser()).toBe(false);
    });

    it('discards an expired session and clears storage', () => {
      storage.session = expiredSession();

      auth.actions.restoreSession();

      expect(auth.data.isAuthenticated()).toBe(false);
      expect(storage.session).toBeNull();
      expect(repository.currentUserCalls).toBe(0);
    });
  });

  describe('login', () => {
    it('persists the session, then loads the user', () => {
      const session = validSession();

      auth.actions.login(TEST_CREDENTIALS);
      expect(auth.loadingStatuses.isLoggingIn()).toBe(true);

      repository.login$.next(session);

      expect(auth.loadingStatuses.isLoggingIn()).toBe(false);
      expect(auth.data.isAuthenticated()).toBe(true);
      expect(auth.data.accessToken()).toBe(session.accessToken);
      expect(storage.session).toEqual(session);
      expect(auth.loadingStatuses.isLoadingCurrentUser()).toBe(true);

      repository.currentUser$.next(TEST_USER);

      expect(auth.data.user()).toEqual(TEST_USER);
    });

    it('exposes the login error and stays anonymous on failure', () => {
      const error = authError('invalid-credentials');

      auth.actions.login(TEST_CREDENTIALS);
      repository.login$.error(error);

      expect(auth.errorStatuses.login()).toEqual(error);
      expect(auth.loadingStatuses.isLoggingIn()).toBe(false);
      expect(auth.data.isAuthenticated()).toBe(false);
      expect(storage.session).toBeNull();
    });
  });

  describe('current user', () => {
    beforeEach(() => {
      auth.actions.login(TEST_CREDENTIALS);
      repository.login$.next(validSession());
    });

    it('can be reloaded on demand without a new login', () => {
      repository.currentUser$.next(TEST_USER);
      repository.currentUser$ = new Subject();

      auth.actions.reloadCurrentUser();

      expect(auth.loadingStatuses.isLoadingCurrentUser()).toBe(true);
      expect(repository.currentUserCalls).toBe(2);
      expect(repository.loginCalls).toBe(1);
    });

    it('keeps the session when the profile cannot be loaded for a transient reason', () => {
      const error = authError('network');

      repository.currentUser$.error(error);

      expect(auth.data.isAuthenticated()).toBe(true);
      expect(auth.errorStatuses.currentUser()).toEqual(error);
      expect(auth.errorStatuses.login()).toBeNull();
    });

    it('terminates the session when the backend rejects the token', () => {
      repository.currentUser$.error(authError('unauthorized'));

      expect(auth.data.isAuthenticated()).toBe(false);
      expect(auth.data.user()).toBeNull();
      expect(storage.session).toBeNull();
    });
  });

  describe('logout', () => {
    it('clears state and storage, and ignores a user response that arrives afterwards', () => {
      auth.actions.login(TEST_CREDENTIALS);
      repository.login$.next(validSession());
      expect(auth.loadingStatuses.isLoadingCurrentUser()).toBe(true);

      auth.actions.logout();
      repository.currentUser$.next(TEST_USER);

      expect(auth.data.isAuthenticated()).toBe(false);
      expect(auth.data.user()).toBeNull();
      expect(auth.loadingStatuses.isLoadingCurrentUser()).toBe(false);
      expect(storage.session).toBeNull();
    });
  });

  describe('concurrency', () => {
    it('runs independent effects at the same time without a global lock', () => {
      auth.actions.login(TEST_CREDENTIALS);
      auth.actions.reloadCurrentUser();

      expect(auth.loadingStatuses.isLoggingIn()).toBe(true);
      expect(auth.loadingStatuses.isLoadingCurrentUser()).toBe(true);
      expect(repository.loginCalls).toBe(1);
      expect(repository.currentUserCalls).toBe(1);
    });

    it('lets one operation finish while the other one is still pending', () => {
      const session = validSession();

      auth.actions.reloadCurrentUser();
      auth.actions.login(TEST_CREDENTIALS);
      repository.login$.next(session);

      expect(auth.loadingStatuses.isLoggingIn()).toBe(false);
      expect(auth.data.isAuthenticated()).toBe(true);
      expect(auth.loadingStatuses.isLoadingCurrentUser()).toBe(true);
    });

    it('keeps the error of one operation separate from the outcome of another', () => {
      const loginError = authError('invalid-credentials');

      auth.actions.login(TEST_CREDENTIALS);
      auth.actions.reloadCurrentUser();
      repository.login$.error(loginError);
      repository.currentUser$.error(authError('network'));

      expect(auth.errorStatuses.login()).toEqual(loginError);
      expect(auth.errorStatuses.currentUser()).toEqual(authError('network'));
    });
  });
});
