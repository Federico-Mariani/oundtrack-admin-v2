import { MoviesRequestOperation } from '../movies-request-operation';
import { MOVIES_STATE_DEFINITION } from '../movies-state-definition';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { CreateMovieCommand } from '../../commands/create-movie.command';
import type { MovieModel } from '../../../domain/models/movie.model';

export const MoviesCreateActions = createRequestActions<
  { readonly movie: CreateMovieCommand },
  { readonly movie: MovieModel },
  { readonly error: RequestError }
>(MOVIES_STATE_DEFINITION.source, MoviesRequestOperation.Create);
