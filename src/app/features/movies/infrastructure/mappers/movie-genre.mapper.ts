import type { MovieGenreResponseDto } from '../api/movie-genre-response.dto';
import type { MovieGenre } from '../../domain/models/movie-genre.model';
import { toLocalized } from '@shared/localization/localized.mapper';
import { toMovieGenreInfo } from './movie-genre-info.mapper';

export function toMovieGenre(dto: MovieGenreResponseDto): MovieGenre {
  return {
    id: dto.id,
    info: toLocalized(dto.info, toMovieGenreInfo),
  };
}
