import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MOVIES_I18N_SCOPE, moviesTranslationsLoader } from '../i18n/movies-translations.loader';

/** Routes owned by the Movies feature. Pages are lazily loaded. */
export const MOVIES_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideTranslocoScope({ scope: MOVIES_I18N_SCOPE, loader: moviesTranslationsLoader }),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('../pages/movies-page/movies-page').then((m) => m.MoviesPage),
      },
    ],
  },
];
