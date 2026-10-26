import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';
export const avatarsTranslationsLoader = createTranslationLoader({
  en: {
    catalog: () => import('./en/catalog.json'),
    table: () => import('./en/table.json'),
    editor: () => import('./en/editor.json'),
  },
  it: {
    catalog: () => import('./it/catalog.json'),
    table: () => import('./it/table.json'),
    editor: () => import('./it/editor.json'),
  },
});
