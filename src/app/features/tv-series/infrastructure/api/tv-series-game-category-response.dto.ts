import type { TvSeriesGameCategoryInfoResponseDto } from './tv-series-game-category-info-response.dto';

export interface TvSeriesGameCategoryResponseDto {
  readonly id: string;
  readonly image: string | null;
  readonly info: Array<TvSeriesGameCategoryInfoResponseDto>;
}
