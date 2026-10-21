import { toApiLocale } from '@app/core/http/api-locale.mapper';
import type { CreateMovieCommand } from '../../application/commands/create-movie.command';
import type { CreateMovieRequestDto } from '../api/create-movie-request.dto';
export function toCreateMovieRequest(movie: CreateMovieCommand): CreateMovieRequestDto {
  return { title: movie.title.trim(), year: movie.year, language: toApiLocale(movie.language) };
}
