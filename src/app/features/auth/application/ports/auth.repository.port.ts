import type { Observable } from 'rxjs';
import type { AuthSessionModel } from '../../domain/models/auth-session.model';
import type { LoginCredentialsModel } from '../../domain/models/login-credentials.model';
import type { UserModel } from '../../domain/models/user.model';

/**
 * Port towards the authentication backend, consumed by the application
 * effects and bound to its HTTP implementation in `auth.providers.ts`.
 *
 * It lives in the application layer (not in the domain) because its contract
 * is expressed with RxJS Observables; the domain stays plain TypeScript.
 * Implementations live in `infrastructure/` and must reject with an `AuthError`.
 */
export interface AuthRepositoryPort {
  login(credentials: LoginCredentialsModel): Observable<AuthSessionModel>;

  getCurrentUser(): Observable<UserModel>;
}
