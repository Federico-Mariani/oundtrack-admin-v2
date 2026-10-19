import type { TvSeriesModel } from './tv-series.model';
import type { TvSeriesGameCategoryModel } from './tv-series-game-category.model';
import type { TvSeriesSoundtrackModel } from './tv-series-soundtrack.model';

export interface TvSeriesDetailModel extends TvSeriesModel {
  readonly gameCategories: ReadonlyArray<TvSeriesGameCategoryModel>;
  readonly soundtracks: ReadonlyArray<TvSeriesSoundtrackModel>;
}
