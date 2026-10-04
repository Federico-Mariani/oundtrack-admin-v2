import type { Routes } from '@angular/router';

/**
 * Application composition root for routing: it only composes the public routing
 * API of each feature (lazily) and defines app-level fallback. It knows no
 * feature internals (pages, guards, paths); each feature owns its own routes.
 */
export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@features/auth').then((feature) => feature.AUTH_ROUTES),
  },
  {
    path: '',
    loadChildren: () => import('@features/home').then((feature) => feature.HOME_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
