import type { TvSeriesResponseDto } from './tv-series-response.dto';
import type { TvSeriesGameCategoryResponseDto } from './tv-series-game-category-response.dto';
import type { TvSeriesSoundtrackResponseDto } from './tv-series-soundtrack-response.dto';

export interface TvSeriesDetailResponseDto extends TvSeriesResponseDto {
  readonly gameCategories: ReadonlyArray<TvSeriesGameCategoryResponseDto>;
  readonly soundtracks: ReadonlyArray<TvSeriesSoundtrackResponseDto>;
}
