import {
    isSupportedLanguage,
    type SupportedLanguage,
} from './supported-language';

export function normalizeLanguage(
    value: string | null | undefined,
): SupportedLanguage | null {
    if (!value) {
        return null;
    }

    const [language] = value.toLowerCase().split('-');

    return isSupportedLanguage(language)
        ? language
        : null;
}