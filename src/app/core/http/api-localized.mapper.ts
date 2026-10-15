import type { Localized } from '@shared/localization/localized';
import { toLocalized } from '@shared/localization/localized.mapper';
import { fromApiLocale } from './api-locale.mapper';
export function mapApiLocalized<TSource extends { readonly language: string }, TValue>(
  values: ReadonlyArray<TSource>,
  mapper: (value: TSource) => TValue,
): Localized<TValue> {
  return toLocalized(
    values.map((value) => ({ ...value, language: fromApiLocale(value.language) })),
    mapper,
  );
}
