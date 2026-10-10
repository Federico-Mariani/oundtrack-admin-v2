import type { Routes } from '@angular/router';
import { AUTH_PATHS } from '@features/auth';
import { MOVIES_PATHS } from '@features/movies';

export const routes: Routes = [
  {
    path: AUTH_PATHS.root,
    loadChildren: () => import('@features/auth').then(({ AUTH_ROUTES }) => AUTH_ROUTES),
  },

  {
    path: '',
    loadComponent: () =>
      import('./presentation/layouts/default-layout/default-layout').then(
        ({ DefaultLayout }) => DefaultLayout,
      ),
    children: [
      {
        path: '',
        loadChildren: () => import('@features/home').then(({ HOME_ROUTES }) => HOME_ROUTES),
      },
    ],
  },

  {
    path: MOVIES_PATHS.root,
    loadChildren: () => import('@features/movies').then(({ MOVIES_ROUTES }) => MOVIES_ROUTES),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
