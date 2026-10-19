import type { Id } from '@shared/types/id';
import type { TvSeriesGenreInfoModel } from './tv-series-genre-info.model';
import type { Localized } from '@shared/localization/localized';

export interface TvSeriesGenreModel {
  readonly id: Id;
  readonly info: Localized<TvSeriesGenreInfoModel>;
}
