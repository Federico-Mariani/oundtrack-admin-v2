import type { MovieModel } from '../../domain/models/movie.model';
import type { MovieResponseDto } from '../api/movie-response.dto';
import { toGenre } from '@app/core/catalog/mappers/genre.mapper';
import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import { toMovieInfo } from './movie-info.mapper';

export function toMovie(dto: MovieResponseDto): MovieModel {
  return {
    id: dto.id,
    externalMovieId: dto.externalMovieId,
    genres: dto.genres.map(toGenre),
    info: mapApiLocalized(dto.info, toMovieInfo),
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
