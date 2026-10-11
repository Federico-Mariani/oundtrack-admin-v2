export const SUPPORTED_LOCALES = ['it-IT', 'en-US'] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = 'en-US';

export function isSupportedLocale(value: string): value is SupportedLocale {
  return SUPPORTED_LOCALES.some((locale) => locale === value);
}

export function parseSupportedLocale(value: string): SupportedLocale {
  const locale = SUPPORTED_LOCALES.find((supportedLocale) => supportedLocale === value);

  if (!locale) {
    throw new Error(`Unsupported locale: ${value}`);
  }

  return locale;
}
