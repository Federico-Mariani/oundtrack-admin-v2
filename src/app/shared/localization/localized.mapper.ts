import type { Localized } from './localized';
import { parseSupportedLocale, type SupportedLocale } from './supported-locale';

interface LocalizedSource {
  readonly language: string;
}

export function toLocalized<TSource extends LocalizedSource, TValue>(
  values: readonly TSource[],
  mapper: (value: TSource) => TValue,
): Localized<TValue> {
  const result: Partial<Record<SupportedLocale, TValue>> = {};

  for (const value of values) {
    const locale = parseSupportedLocale(value.language);

    result[locale] = mapper(value);
  }

  return result;
}
