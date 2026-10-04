import type { Routes } from '@angular/router';
import { AUTH_PATHS } from './auth.paths';
import { guestGuard } from './guards/auth.guards';

/** Routes owned by the Auth feature. Pages are lazily loaded. */
export const AUTH_ROUTES: Routes = [
  {
    path: AUTH_PATHS.login,
    canActivate: [guestGuard],
    loadComponent: () => import('../pages/login/login-page').then((m) => m.LoginPage),
  },
];
