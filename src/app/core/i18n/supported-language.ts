/**
 * Single, typed source of truth for the languages the application supports.
 *
 * The UI only ever deals with the language codes below: a language is NOT a
 * locale (no `en-US` / `it-IT`). If locale-aware formatting is needed later,
 * map these codes to a locale in one place rather than scattering strings.
 */
export const SUPPORTED_LANGUAGES = ['en', 'it'] as const;

/** A language code supported by the application. */
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** Default and official fallback language. */
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

/** User-facing metadata for a language (for selectors and accessibility). */
export interface LanguageOption {
  readonly code: SupportedLanguage;
  readonly label: string;
}

/** Centralized, non-duplicated language labels for UI (never hard-coded in components). */
export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'it', label: 'Italiano' },
];

/** Type guard narrowing an arbitrary string to a supported language code. */
export function isSupportedLanguage(value: string | null | undefined): value is SupportedLanguage {
  return (
    value !== null &&
    value !== undefined &&
    (SUPPORTED_LANGUAGES as readonly string[]).includes(value)
  );
}

/**
 * Normalizes a raw language tag (e.g. a BCP-47 `navigator.language` such as
 * `it-IT`) to a supported language, or `null` when unsupported (`fr-FR`).
 */
export function normalizeLanguage(value: string | null | undefined): SupportedLanguage | null {
  if (value === null || value === undefined) {
    return null;
  }
  const primary = value.toLowerCase().split('-')[0];
  return isSupportedLanguage(primary) ? primary : null;
}
