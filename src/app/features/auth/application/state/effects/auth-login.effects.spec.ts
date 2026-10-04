import { Actions } from '@ngrx/effects';
import type { Action } from '@ngrx/store';
import { Subject } from 'rxjs';
import { authError, TEST_CREDENTIALS, validSession } from '../../../testing/auth.fixtures';
import { FakeAuthRepository } from '../../../testing/fake-auth.repository';
import { AuthLoginActions, AuthLoginApiActions } from '../actions/auth-login.actions';
import { login$ } from './auth-login.effects';

describe('login$', () => {
  let actions$: Subject<Action>;
  let repository: FakeAuthRepository;
  let output: Action[];

  beforeEach(() => {
    actions$ = new Subject<Action>();
    repository = new FakeAuthRepository();
    output = [];

    login$(new Actions(actions$), repository).subscribe((action) => output.push(action));
  });

  it('maps a successful repository call to Succeeded', () => {
    const session = validSession();

    actions$.next(AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }));
    repository.login$.next(session);

    expect(output).toEqual([AuthLoginApiActions.succeeded({ session })]);
  });

  it('maps a repository failure to Failed and keeps the stream alive', () => {
    const error = authError('invalid-credentials');

    actions$.next(AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }));
    repository.login$.error(error);

    expect(output).toEqual([AuthLoginApiActions.failed({ error })]);

    repository.login$ = new Subject();
    actions$.next(AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }));

    expect(repository.loginCalls).toBe(2);
  });

  it('ignores a second request while one is in flight (exhaustMap)', () => {
    actions$.next(AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }));
    actions$.next(AuthLoginActions.requested({ credentials: TEST_CREDENTIALS }));

    expect(repository.loginCalls).toBe(1);
  });
});
