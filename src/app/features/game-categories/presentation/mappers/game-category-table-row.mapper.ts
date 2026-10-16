import { resolveLocalized } from '@shared/localization/localized.queries';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@shared/localization/supported-locale';
import type { GameCategoryModel } from '../../domain/models/game-category.model';
import type { GameCategoryTableRowModel } from '../models/game-category-table-row.model';

export function toGameCategoryTableRow(
  category: GameCategoryModel,
  locale: SupportedLocale,
): GameCategoryTableRowModel {
  const info = resolveLocalized(category.info, locale);

  return {
    id: category.id,
    name: info?.name ?? '—',
    imageUrl: category.image,
    languages: SUPPORTED_LOCALES.filter((language) => Boolean(category.info[language])),
  };
}
