import type { Id } from '@shared/types/id';
import type { Localized } from '@shared/localization/localized';
import type { TvSeriesGameCategoryInfoModel } from './tv-series-game-category-info.model';

export interface TvSeriesGameCategoryModel {
  readonly id: Id;
  readonly image: string | null;
  readonly info: Localized<TvSeriesGameCategoryInfoModel>;
}
