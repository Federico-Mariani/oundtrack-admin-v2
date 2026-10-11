import type { MovieInfoResponseDto } from '../api/movie-info-response.dto';
import type { MovieInfo } from '../../domain/models/movie-info.model';

export function toMovieInfo(dto: MovieInfoResponseDto): MovieInfo {
  return {
    id: dto.id,
    title: dto.title,
    releaseDate: dto.releaseDate,
    posterUrl: dto.posterUrl,
    backdropUrl: dto.backdropUrl,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
