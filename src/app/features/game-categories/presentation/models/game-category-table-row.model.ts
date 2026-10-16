import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { Id } from '@shared/types/id';

export interface GameCategoryTableRowModel {
  readonly id: Id;
  readonly name: string;
  readonly imageUrl: string | null;
  readonly languages: ReadonlyArray<SupportedLocale>;
}
