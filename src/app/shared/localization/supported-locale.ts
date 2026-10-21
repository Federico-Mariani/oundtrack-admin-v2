export const SupportedLocale = { Italian: 'it-IT', English: 'en-US' } as const;

export const SUPPORTED_LOCALES = [SupportedLocale.Italian, SupportedLocale.English] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = SupportedLocale.English;

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
