import type { Localized } from './localized';
import { DEFAULT_LOCALE, type SupportedLocale } from './supported-locale';

export function getLocalized<T>(localized: Localized<T>, locale: SupportedLocale): T | null {
  return localized[locale] ?? null;
}

export function resolveLocalized<T>(
  localized: Localized<T>,
  locale: SupportedLocale,
  fallbackLocale: SupportedLocale = DEFAULT_LOCALE,
): T | null {
  return localized[locale] ?? localized[fallbackLocale] ?? null;
}
