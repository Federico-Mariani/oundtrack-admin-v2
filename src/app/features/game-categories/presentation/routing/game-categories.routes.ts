import type { Routes } from '@angular/router';
import { provideTranslocoScope } from '@jsverse/transloco';
import {
  GAME_CATEGORIES_I18N_SCOPE,
  gameCategoriesTranslationsLoader,
} from '../i18n/game-categories-translations.loader';

/** Routes owned by the Movies feature. Pages are lazily loaded. */
export const GAME_CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideTranslocoScope({
        scope: GAME_CATEGORIES_I18N_SCOPE,
        loader: gameCategoriesTranslationsLoader,
      }),
    ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('../pages/game-categories-page/game-categories-page').then(
            (m) => m.GameCategoriesPage,
          ),
      },
    ],
  },
];
