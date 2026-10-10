/**
 * Public API of the Auth feature.
 * Other features and the app shell must import from here only;
 * everything else inside `features/auth` is an implementation detail.
 */
export { AuthFacade } from './application/state/facades/auth.facade';
export type { User } from './domain/models/user';
export type { LoginCredentials } from './domain/models/login-credentials';
export { provideAuth } from './auth.providers';
export { authTokenInterceptor } from './infrastructure/http/auth-token.interceptor';
export { authGuard } from './presentation/routing/guards/auth.guards';
export { guestGuard } from './presentation/routing/guards/guest.guards';
export { AUTH_ROUTES } from './presentation/routing/auth.routes';
export { AUTH_PATHS } from './presentation/routing/auth.paths';
export { AuthNavigationService } from './presentation/routing/auth-navigation.service';
