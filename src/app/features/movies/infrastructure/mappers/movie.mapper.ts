import type {Movie} from '../../domain/models/movie';
import type {MovieResponseDto} from "../api/movie-response.dto";

export function toMovie(dto: MovieResponseDto): Movie {
  return {
    id: dto.id,
  };
}
