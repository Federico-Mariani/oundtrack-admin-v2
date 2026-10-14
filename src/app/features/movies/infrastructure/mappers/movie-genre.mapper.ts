import type { MovieGenreResponseDto } from '../api/movie-genre-response.dto';
import type { MovieGenreModel } from '../../domain/models/movie-genre.model';
import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import { toMovieGenreInfo } from './movie-genre-info.mapper';

export function toMovieGenre(dto: MovieGenreResponseDto): MovieGenreModel {
  return {
    id: dto.id,
    info: mapApiLocalized(dto.info, toMovieGenreInfo),
  };
}
