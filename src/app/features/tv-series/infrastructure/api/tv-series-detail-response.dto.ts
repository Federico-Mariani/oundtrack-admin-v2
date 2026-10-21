import type { TvSeriesResponseDto } from './tv-series-response.dto';
import type { GameCategoryResponseDto } from '@app/core/catalog/api/game-category-response.dto';
import type { SoundtrackResponseDto } from '@app/core/catalog/api/soundtrack-response.dto';

export interface TvSeriesDetailResponseDto extends TvSeriesResponseDto {
  readonly gameCategories: ReadonlyArray<GameCategoryResponseDto>;
  readonly soundtracks: ReadonlyArray<SoundtrackResponseDto>;
}
