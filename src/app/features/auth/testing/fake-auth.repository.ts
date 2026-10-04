import { type Observable, Subject } from 'rxjs';
import type { AuthSession } from '../domain/models/auth-session';
import type { User } from '../domain/models/user';
import type { AuthRepository } from '../application/ports/auth.repository';

/**
 * Test double for `AuthRepository`. Each call returns a hot `Subject` so tests
 * drive success/failure explicitly with `next()` / `error()`. Subjects are
 * reassignable because an errored Subject cannot be reused.
 */
export class FakeAuthRepository implements AuthRepository {
  login$ = new Subject<AuthSession>();
  register$ = new Subject<AuthSession>();
  currentUser$ = new Subject<User>();

  loginCalls = 0;
  registerCalls = 0;
  currentUserCalls = 0;

  login(): Observable<AuthSession> {
    this.loginCalls++;
    return this.login$;
  }

  register(): Observable<AuthSession> {
    this.registerCalls++;
    return this.register$;
  }

  getCurrentUser(): Observable<User> {
    this.currentUserCalls++;
    return this.currentUser$;
  }
}
