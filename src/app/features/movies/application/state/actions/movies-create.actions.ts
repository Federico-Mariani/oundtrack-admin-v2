import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { CreateMovieModel } from '../../../domain/models/create-movie.model';
import type { MovieModel } from '../../../domain/models/movie.model';

export const MoviesCreateActions = createRequestActions<
  { readonly movie: CreateMovieModel },
  { readonly movie: MovieModel },
  { readonly error: RequestError }
>('Movies', 'Create');
