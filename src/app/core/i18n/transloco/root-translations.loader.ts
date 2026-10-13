import { createTranslationLoader } from './translation-loader';

export const ROOT_TRANSLATIONS_LOADER = createTranslationLoader({
  en: {
    validation: () => import('@app/core/i18n/translations/en/validation.json'),
  },

  it: {
    validation: () => import('@app/core/i18n/translations/it/validation.json'),
  },
});
