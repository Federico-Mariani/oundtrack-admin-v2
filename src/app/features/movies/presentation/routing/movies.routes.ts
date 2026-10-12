import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MOVIES_I18N_SCOPE, moviesTranslationsLoader } from '../i18n/movies-translations.loader';
import { MOVIES_PATHS } from './movies.paths';

/** Routes owned by the Auth feature. Pages are lazily loaded. */
export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideTranslocoScope({ scope: MOVIES_I18N_SCOPE, loader: moviesTranslationsLoader }),
    ],
    children: [
      {
        path: '',
        loadComponent: () => import('../pages/movies-page/movies-page').then((m) => m.MoviesPage),
      },
      {
        path: MOVIES_PATHS.create,
        loadComponent: () =>
          import('../pages/create-one-movie-page/create-one-movie-page').then(
            (m) => m.CreateOneMoviePage,
          ),
      },
    ],
  },
];
