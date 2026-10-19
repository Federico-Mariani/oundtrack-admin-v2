import type { TvSeriesGenreInfoResponseDto } from './tv-series-genre-info-response.dto';

export interface TvSeriesGenreResponseDto {
  readonly id: string;
  readonly info: Array<TvSeriesGenreInfoResponseDto>;
}
