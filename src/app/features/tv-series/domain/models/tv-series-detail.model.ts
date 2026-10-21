import type { TvSeriesModel } from './tv-series.model';
import type { GameCategoryModel } from '@shared/types/catalog/game-category.model';
import type { SoundtrackModel } from '@shared/types/catalog/soundtrack.model';

export interface TvSeriesDetailModel extends TvSeriesModel {
  readonly gameCategories: ReadonlyArray<GameCategoryModel>;
  readonly soundtracks: ReadonlyArray<SoundtrackModel>;
}
