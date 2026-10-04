import { Actions } from '@ngrx/effects';
import type { Action } from '@ngrx/store';
import { type Observable, Subject } from 'rxjs';
import { authError, expiredSession, validSession } from '../../../testing/auth.fixtures';
import { InMemoryAuthSessionStorage } from '../../../testing/in-memory-auth-session.storage';
import { AuthLoginApiActions } from '../actions/auth-login.actions';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthRegistrationApiActions } from '../actions/auth-registration.actions';
import { AuthSessionActions, AuthSessionStorageActions } from '../actions/auth-session.actions';
import { AuthUserActions, AuthUserApiActions } from '../actions/auth-user.actions';
import {
  clearPersistedSession$,
  expireSessionOnUnauthorized$,
  loadUserAfterSessionEstablished$,
  persistSession$,
  restoreSession$,
} from './auth-session.effects';

describe('auth session effects', () => {
  let source$: Subject<Action>;
  let actions$: Actions;
  let storage: InMemoryAuthSessionStorage;
  let output: Action[];

  const collect = (effect$: Observable<Action>) =>
    effect$.subscribe((action) => output.push(action));

  beforeEach(() => {
    source$ = new Subject<Action>();
    actions$ = new Actions(source$);
    storage = new InMemoryAuthSessionStorage();
    output = [];
  });

  describe('restoreSession$', () => {
    beforeEach(() => collect(restoreSession$(actions$, storage)));

    it('restores a valid persisted session synchronously', () => {
      const session = validSession();
      storage.session = session;

      source$.next(AuthSessionActions.restoreRequested());

      expect(output).toEqual([AuthSessionStorageActions.restoreSucceeded({ session })]);
    });

    it('reports no session when nothing is persisted', () => {
      source$.next(AuthSessionActions.restoreRequested());

      expect(output).toEqual([AuthSessionStorageActions.noSessionFound()]);
    });

    it('treats an expired session as no session', () => {
      storage.session = expiredSession();

      source$.next(AuthSessionActions.restoreRequested());

      expect(output).toEqual([AuthSessionStorageActions.noSessionFound()]);
    });
  });

  describe('persistSession$', () => {
    beforeEach(() => collect(persistSession$(actions$, storage)));

    it('saves the session issued by login or registration', () => {
      const session = validSession();

      source$.next(AuthLoginApiActions.succeeded({ session }));
      expect(storage.session).toEqual(session);

      storage.clear();
      source$.next(AuthRegistrationApiActions.succeeded({ session }));
      expect(storage.session).toEqual(session);
    });
  });

  describe('clearPersistedSession$', () => {
    beforeEach(() => collect(clearPersistedSession$(actions$, storage)));

    it.each([
      ['logout', AuthLogoutActions.requested()],
      ['expiry', AuthSessionActions.expired()],
      ['unusable persisted data', AuthSessionStorageActions.noSessionFound()],
    ])('clears storage on %s', (_label, action) => {
      storage.session = validSession();

      source$.next(action);

      expect(storage.session).toBeNull();
    });
  });

  describe('loadUserAfterSessionEstablished$', () => {
    beforeEach(() => collect(loadUserAfterSessionEstablished$(actions$)));

    it('requests the current user whenever a session is established', () => {
      const session = validSession();

      source$.next(AuthLoginApiActions.succeeded({ session }));
      source$.next(AuthRegistrationApiActions.succeeded({ session }));
      source$.next(AuthSessionStorageActions.restoreSucceeded({ session }));

      expect(output).toEqual([
        AuthUserActions.loadRequested(),
        AuthUserActions.loadRequested(),
        AuthUserActions.loadRequested(),
      ]);
    });
  });

  describe('expireSessionOnUnauthorized$', () => {
    beforeEach(() => collect(expireSessionOnUnauthorized$(actions$)));

    it('expires the session only when the backend rejects the token', () => {
      source$.next(AuthUserApiActions.loadFailed({ error: authError('network') }));
      expect(output).toEqual([]);

      source$.next(AuthUserApiActions.loadFailed({ error: authError('unauthorized') }));
      expect(output).toEqual([AuthSessionActions.expired()]);
    });
  });
});
