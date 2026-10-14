import type { MovieModel } from '../../domain/models/movie.model';
import type { MovieResponseDto } from '../api/movie-response.dto';
import { toMovieGenre } from './movie-genre.mapper';
import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import { toMovieInfo } from './movie-info.mapper';

export function toMovie(dto: MovieResponseDto): MovieModel {
  return {
    id: dto.id,
    externalMovieId: dto.externalMovieId,
    genres: dto.genres.map(toMovieGenre),
    info: mapApiLocalized(dto.info, toMovieInfo),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
