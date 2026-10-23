import type { Translation } from '@jsverse/transloco';

import type { SupportedLanguage } from '../language/supported-language';

type TranslationFileLoader = () => Promise<{
  default: Translation;
}>;

interface TranslationTree {
  readonly [key: string]: TranslationFileLoader | TranslationTree;
}

export function createTranslationLoader(
  translations: Record<SupportedLanguage, TranslationTree>,
): Record<SupportedLanguage, () => Promise<Translation>> {
  return {
    en: cachedLoader(translations.en),
    it: cachedLoader(translations.it),
  };
}

async function loadTranslations(tree: TranslationTree): Promise<Translation> {
  const entries = await Promise.all(
    Object.entries(tree).map(async ([key, value]) => {
      if (typeof value === 'function') {
        const translation = await value();

        return [key, translation.default] as const;
      }

      return [key, await loadTranslations(value)] as const;
    }),
  );

  return Object.fromEntries(entries);
}

function cachedLoader(tree: TranslationTree): () => Promise<Translation> {
  let pending: Promise<Translation> | undefined;
  return () => {
    pending ??= loadTranslations(tree).catch((error: unknown) => {
      pending = undefined;
      throw error;
    });
    return pending;
  };
}
