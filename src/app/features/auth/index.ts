/**
 * Public API of the Auth feature.
 * Other features and the app shell must import from here only;
 * everything else inside `features/auth` is an implementation detail.
 */
export { AuthFacade } from './application/state/facades/auth.facade';
export type { User } from './domain/models/user';
export type { LoginCredentials } from './domain/models/login-credentials';
export type { RegistrationData } from './domain/models/registration-data';
export type { AuthError, AuthErrorCode } from './domain/errors/auth-error';
export { provideAuth } from './auth.providers';
export { authTokenInterceptor } from './infrastructure/http/auth-token.interceptor';
export { authGuard, guestGuard } from './presentation/guards/auth.guards';
export { AUTH_ROUTES } from './presentation/auth.routes';
export { AUTH_PATHS } from './presentation/auth.paths';
