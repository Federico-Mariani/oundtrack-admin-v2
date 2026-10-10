import type { Observable } from 'rxjs';
import type { AuthSession } from '../../domain/models/auth-session';
import type { LoginCredentials } from '../../domain/models/login-credentials';
import type { User } from '../../domain/models/user';

/**
 * Port towards the authentication backend, consumed by the application
 * effects and bound to its HTTP implementation in `auth.providers.ts`.
 *
 * It lives in the application layer (not in the domain) because its contract
 * is expressed with RxJS Observables; the domain stays plain TypeScript.
 * Implementations live in `infrastructure/` and must reject with an `AuthError`.
 */
export interface AuthRepository {
  login(credentials: LoginCredentials): Observable<AuthSession>;

  getCurrentUser(): Observable<User>;
}
