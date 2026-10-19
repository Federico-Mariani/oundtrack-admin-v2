import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import { TV_SERIES_PATHS } from './tv-series.paths';
import {
  TV_SERIES_I18N_SCOPE,
  tvSeriesTranslationsLoader,
} from '../i18n/tv-series-translations.loader';

export const TV_SERIES_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideTranslocoScope({ scope: TV_SERIES_I18N_SCOPE, loader: tvSeriesTranslationsLoader }),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('../pages/tv-series-page/tv-series-page').then((m) => m.TvSeriesPage),
      },
      {
        path: TV_SERIES_PATHS.create,
        loadComponent: () =>
          import('../pages/create-one-tv-series-page/create-one-tv-series-page').then(
            (m) => m.CreateOneTvSeriesPage,
          ),
      },
    ],
  },
];
