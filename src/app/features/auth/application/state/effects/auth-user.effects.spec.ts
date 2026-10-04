import { Actions } from '@ngrx/effects';
import type { Action } from '@ngrx/store';
import { Subject } from 'rxjs';
import { authError, TEST_USER } from '../../../testing/auth.fixtures';
import { FakeAuthRepository } from '../../../testing/fake-auth.repository';
import { AuthLogoutActions } from '../actions/auth-logout.actions';
import { AuthSessionActions } from '../actions/auth-session.actions';
import { AuthUserActions, AuthUserApiActions } from '../actions/auth-user.actions';
import { loadCurrentUser$ } from './auth-user.effects';

describe('loadCurrentUser$', () => {
  let actions$: Subject<Action>;
  let repository: FakeAuthRepository;
  let output: Action[];

  beforeEach(() => {
    actions$ = new Subject<Action>();
    repository = new FakeAuthRepository();
    output = [];

    loadCurrentUser$(new Actions(actions$), repository).subscribe((action) => output.push(action));
  });

  it('maps the loaded user to Load Succeeded', () => {
    actions$.next(AuthUserActions.loadRequested());
    repository.currentUser$.next(TEST_USER);

    expect(output).toEqual([AuthUserApiActions.loadSucceeded({ user: TEST_USER })]);
  });

  it('maps a repository failure to Load Failed', () => {
    const error = authError('unauthorized');

    actions$.next(AuthUserActions.loadRequested());
    repository.currentUser$.error(error);

    expect(output).toEqual([AuthUserApiActions.loadFailed({ error })]);
  });

  it('only honours the latest request (switchMap)', () => {
    const first = repository.currentUser$;

    actions$.next(AuthUserActions.loadRequested());
    repository.currentUser$ = new Subject();
    actions$.next(AuthUserActions.loadRequested());

    first.next(TEST_USER);
    expect(output).toEqual([]);

    repository.currentUser$.next(TEST_USER);
    expect(output).toEqual([AuthUserApiActions.loadSucceeded({ user: TEST_USER })]);
  });

  it.each([
    ['logout', AuthLogoutActions.requested()],
    ['session expiry', AuthSessionActions.expired()],
  ])('drops the in-flight response when the session ends by %s', (_label, terminator) => {
    actions$.next(AuthUserActions.loadRequested());
    actions$.next(terminator);
    repository.currentUser$.next(TEST_USER);

    expect(output).toEqual([]);
  });
});
