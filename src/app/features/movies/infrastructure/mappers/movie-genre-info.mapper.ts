import type { MovieGenreInfoModel } from '../../domain/models/movie-genre-info.model';
import type { MovieGenreInfoResponseDto } from '../api/movie-genre-info-response.dto';

export function toMovieGenreInfo(dto: MovieGenreInfoResponseDto): MovieGenreInfoModel {
  return {
    id: dto.id,
    name: dto.name,
  };
}
