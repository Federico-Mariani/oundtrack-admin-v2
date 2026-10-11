import type { Movie } from '../../domain/models/movie.model';
import type { MovieResponseDto } from '../api/movie-response.dto';
import { toMovieGenre } from './movie-genre.mapper';
import { toLocalized } from '@shared/localization/localized.mapper';
import { toMovieInfo } from './movie-info.mapper';

export function toMovie(dto: MovieResponseDto): Movie {
  return {
    id: dto.id,
    externalMovieId: dto.externalMovieId,
    genres: dto.genres.map(toMovieGenre),
    info: toLocalized(dto.info, toMovieInfo),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
