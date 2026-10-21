import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';
export const soundtracksTranslationsLoader = createTranslationLoader({
  en: { audio: () => import('./en/audio.json') },
  it: { audio: () => import('./it/audio.json') },
});
