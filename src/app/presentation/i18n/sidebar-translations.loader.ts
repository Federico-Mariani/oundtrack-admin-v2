import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';

export const sidebarTranslationsLoader = createTranslationLoader({
  en: { menu: () => import('./en/sidebar.json') },
  it: { menu: () => import('./it/sidebar.json') },
});
