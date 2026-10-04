import { Actions } from '@ngrx/effects';
import type { Action } from '@ngrx/store';
import { Subject } from 'rxjs';
import { authError, TEST_REGISTRATION, validSession } from '../../../testing/auth.fixtures';
import { FakeAuthRepository } from '../../../testing/fake-auth.repository';
import {
  AuthRegistrationActions,
  AuthRegistrationApiActions,
} from '../actions/auth-registration.actions';
import { register$ } from './auth-registration.effects';

describe('register$', () => {
  let actions$: Subject<Action>;
  let repository: FakeAuthRepository;
  let output: Action[];

  beforeEach(() => {
    actions$ = new Subject<Action>();
    repository = new FakeAuthRepository();
    output = [];

    register$(new Actions(actions$), repository).subscribe((action) => output.push(action));
  });

  it('maps a successful repository call to Succeeded', () => {
    const session = validSession();

    actions$.next(AuthRegistrationActions.requested({ data: TEST_REGISTRATION }));
    repository.register$.next(session);

    expect(output).toEqual([AuthRegistrationApiActions.succeeded({ session })]);
  });

  it('maps a repository failure to Failed', () => {
    const error = authError('email-already-registered');

    actions$.next(AuthRegistrationActions.requested({ data: TEST_REGISTRATION }));
    repository.register$.error(error);

    expect(output).toEqual([AuthRegistrationApiActions.failed({ error })]);
  });

  it('never creates two accounts for a double submit (exhaustMap)', () => {
    actions$.next(AuthRegistrationActions.requested({ data: TEST_REGISTRATION }));
    actions$.next(AuthRegistrationActions.requested({ data: TEST_REGISTRATION }));

    expect(repository.registerCalls).toBe(1);
  });
});
