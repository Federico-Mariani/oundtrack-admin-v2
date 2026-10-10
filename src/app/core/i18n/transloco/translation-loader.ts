import type { Translation } from '@jsverse/transloco';

import type { SupportedLanguage } from '../language/supported-language';

type TranslationFileLoader = () => Promise<{
    default: Translation;
}>;

type TranslationTree = {
    readonly [key: string]:
        | TranslationFileLoader
        | TranslationTree;
};

export function createTranslationLoader(
    translations: Record<SupportedLanguage, TranslationTree>,
): Record<SupportedLanguage, () => Promise<Translation>> {
    return {
        en: () => loadTranslations(translations.en),
        it: () => loadTranslations(translations.it),
    };
}

async function loadTranslations(
    tree: TranslationTree,
): Promise<Translation> {
    const entries = await Promise.all(
        Object.entries(tree).map(async ([key, value]) => {
            if (typeof value === 'function') {
                const translation = await value();

                return [key, translation.default] as const;
            }

            return [
                key,
                await loadTranslations(value),
            ] as const;
        }),
    );

    return Object.fromEntries(entries);
}