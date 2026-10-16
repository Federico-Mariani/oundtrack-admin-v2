import { parseSupportedLocale, type SupportedLocale } from '@shared/localization/supported-locale';

/** API's legacy English identifier is isolated at the transport boundary. */
export function toApiLocale(locale: SupportedLocale): string {
  return locale === 'en-US' ? 'en-EN' : locale;
}
export function fromApiLocale(locale: string): SupportedLocale {
  return parseSupportedLocale(locale === 'en-EN' ? 'en-US' : locale);
}

export function toApiLocales(locales: Array<SupportedLocale>): Array<string> {
  return locales.map(toApiLocale);
}

export function fromApiLocales(locales: Array<string>): Array<SupportedLocale> {
  return locales.map(fromApiLocale);
}
