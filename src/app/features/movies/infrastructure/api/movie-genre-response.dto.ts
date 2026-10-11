import type { MovieGenreInfoResponseDto } from './movie-genre-info-response.dto';

export interface MovieGenreResponseDto {
  readonly id: string;
  readonly info: MovieGenreInfoResponseDto[];
}
