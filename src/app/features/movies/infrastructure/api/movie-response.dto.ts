import type { Id } from '@shared/types/id';
import type { GenreResponseDto } from '@app/core/catalog/api/genre-response.dto';
import type { MovieInfoResponseDto } from './movie-info-response.dto';

/** `data` payload returned by `GET /movies`. */
export interface MovieResponseDto {
  readonly id: Id;
  readonly externalMovieId: number;
  readonly genres: Array<GenreResponseDto>;
  readonly info: Array<MovieInfoResponseDto>;
  readonly createdAt: number;
  readonly updatedAt: number;
}
