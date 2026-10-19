import type { Id } from '@shared/types/id';
import type { TvSeriesGenreResponseDto } from './tv-series-genre-response.dto';
import type { TvSeriesInfoResponseDto } from './tv-series-info-response.dto';

/** `data` payload returned by `GET /tv-series`. */
export interface TvSeriesResponseDto {
  readonly id: Id;
  readonly externalTvSeriesId: number;
  readonly genres: Array<TvSeriesGenreResponseDto>;
  readonly info: Array<TvSeriesInfoResponseDto>;
  readonly createdAt: number;
  readonly updatedAt: number;
}
