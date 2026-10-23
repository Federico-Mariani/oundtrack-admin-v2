import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';

export const GAME_CATEGORIES_I18N_SCOPE = 'gameCategories';

export const gameCategoriesTranslationsLoader = createTranslationLoader({
  en: {
    assignment: () => import('./en/assignment.json'),
    errors: () => import('./en/errors.json'),
    catalog: () => import('./en/catalog.json'),
    table: () => import('./en/table.json'),
  },
  it: {
    assignment: () => import('./it/assignment.json'),
    errors: () => import('./it/errors.json'),
    catalog: () => import('./it/catalog.json'),
    table: () => import('./it/table.json'),
  },
});
