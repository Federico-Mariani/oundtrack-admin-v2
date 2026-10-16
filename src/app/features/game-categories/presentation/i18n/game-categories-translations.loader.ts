import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';

export const GAME_CATEGORIES_I18N_SCOPE = 'gameCategories';

export const gameCategoriesTranslationsLoader = createTranslationLoader({
  en: {
    errors: () => import('./en/errors.json'),
    catalog: () => import('./en/catalog.json'),
  },
  it: {
    errors: () => import('./it/errors.json'),
    catalog: () => import('./it/catalog.json'),
  },
});
