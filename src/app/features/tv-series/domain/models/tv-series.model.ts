import type { Id } from '@shared/types/id';
import type { TvSeriesGenreModel } from './tv-series-genre.model';
import type { TvSeriesInfoModel } from './tv-series-info.model';
import type { Localized } from '@shared/localization/localized';

export interface TvSeriesModel {
  readonly id: Id;
  readonly externalTvSeriesId: number;
  readonly genres: ReadonlyArray<TvSeriesGenreModel>;
  readonly info: Localized<TvSeriesInfoModel>;
  readonly createdAt: number;
  readonly updatedAt: number;
}
