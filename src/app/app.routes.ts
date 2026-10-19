import type { Routes } from '@angular/router';
import { AUTH_PATHS, authGuard } from '@features/auth';
import { MOVIES_PATHS } from '@features/movies';
import { GAME_CATEGORIES_PATHS } from '@features/game-categories';
import { TV_SERIES_PATHS } from '@features/tv-series';

export const routes: Routes = [
  {
    path: AUTH_PATHS.root,
    loadChildren: () => import('@features/auth').then(({ AUTH_ROUTES }) => AUTH_ROUTES),
  },

  {
    path: '',
    canActivateChild: [authGuard],
    loadComponent: () =>
      import('./presentation/layouts/default-layout/default-layout').then(
        ({ DefaultLayout }) => DefaultLayout,
      ),
    children: [
      {
        path: '',
        loadChildren: () => import('@features/home').then(({ HOME_ROUTES }) => HOME_ROUTES),
      },
      {
        path: GAME_CATEGORIES_PATHS.root,
        loadChildren: () =>
          import('@features/game-categories').then(
            ({ GAME_CATEGORIES_ROUTES }) => GAME_CATEGORIES_ROUTES,
          ),
      },
      {
        path: MOVIES_PATHS.root,
        loadChildren: () => import('@features/movies').then(({ MOVIES_ROUTES }) => MOVIES_ROUTES),
      },
      {
        path: TV_SERIES_PATHS.root,
        loadChildren: () =>
          import('@features/tv-series').then(({ TV_SERIES_ROUTES }) => TV_SERIES_ROUTES),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];
