import type {Observable} from 'rxjs';
import type {AuthSession} from '../../domain/models/auth-session';
import type {LoginCredentials, RegistrationData, User} from '@features/auth';

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

    register(data: RegistrationData): Observable<AuthSession>;

    getCurrentUser(): Observable<User>;
}
