import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';
export const hintsTranslationsLoader = createTranslationLoader({
  en: { editor: () => import('./en/editor.json') },
  it: { editor: () => import('./it/editor.json') },
});
