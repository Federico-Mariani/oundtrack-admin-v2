import type { Routes } from '@angular/router';
import { authGuard } from '@features/auth';

/** Landing page, reachable only with an authenticated session. */
export const HOME_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
];
