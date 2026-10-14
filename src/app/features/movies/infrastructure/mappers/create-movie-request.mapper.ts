import { toApiLocale } from '@app/core/http/api-locale.mapper';
import type { CreateMovieModel } from '../../domain/models/create-movie.model';
import type { CreateMovieRequestDto } from '../api/create-movie-request.dto';
export function toCreateMovieRequest(movie: CreateMovieModel): CreateMovieRequestDto {
  return { title: movie.title.trim(), year: movie.year, language: toApiLocale(movie.language) };
}
