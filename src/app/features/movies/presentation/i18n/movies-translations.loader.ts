import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';

export const MOVIES_I18N_SCOPE = 'movies';

export const moviesTranslationsLoader = createTranslationLoader({
  en: {
    errors: () => import('./en/errors.json'),
    table: () => import('./en/table.json'),
    catalog: () => import('./en/catalog.json'),
  },
  it: {
    errors: () => import('./it/errors.json'),
    table: () => import('./it/table.json'),
    catalog: () => import('./it/catalog.json'),
  },
});
