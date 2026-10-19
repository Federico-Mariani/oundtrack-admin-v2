import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { Id } from '@shared/types/id';

export interface TvSeriesTableRowModel {
  readonly id: Id;
  readonly externalTvSeriesId: number;
  readonly title: string;
  readonly languages: ReadonlyArray<SupportedLocale>;
  readonly genres: ReadonlyArray<string>;
  readonly releaseDate: number | undefined;
  readonly releaseDateLabel: string;
  readonly posterUrl: string | null;
}
