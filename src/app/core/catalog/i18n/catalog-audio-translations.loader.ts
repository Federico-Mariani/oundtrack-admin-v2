import { createTranslationLoader } from '@app/core/i18n/transloco/translation-loader';
export const catalogAudioTranslationsLoader = createTranslationLoader({
  en: { player: () => import('./en/player.json') },
  it: { player: () => import('./it/player.json') },
});
