import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { AUTH_PATHS } from './auth.paths';
import { guestGuard } from './guards/guest.guard';
import { AUTH_I18N_SCOPE, authTranslationsLoader } from '../i18n/auth-translations.loader';

/** Routes owned by the Auth feature. Pages are lazily loaded. */
export const AUTH_ROUTES: Routes = [
  {
    path: '',
    providers: [provideTranslocoScope({ scope: AUTH_I18N_SCOPE, loader: authTranslationsLoader })],
    children: [
      {
        path: AUTH_PATHS.login,
        canActivate: [guestGuard],
        loadComponent: () => import('../pages/login/login-page').then((m) => m.LoginPage),
      },
    ],
  },
];
