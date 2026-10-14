import { parseSupportedLocale, type SupportedLocale } from '@shared/localization/supported-locale';
/** API's legacy English identifier is isolated at the transport boundary. */
export function toApiLocale(locale: SupportedLocale): string {
  return locale === 'en-US' ? 'en-EN' : locale;
}
export function fromApiLocale(locale: string): SupportedLocale {
  return parseSupportedLocale(locale === 'en-EN' ? 'en-US' : locale);
}
