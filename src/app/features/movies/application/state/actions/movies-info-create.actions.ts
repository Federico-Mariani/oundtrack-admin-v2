import { MoviesRequestOperation } from '../movies-request-operation';
import { MOVIES_STATE_DEFINITION } from '../movies-state-definition';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { CreateMovieInfoCommand } from '../../commands/create-movie-info.command';

export const MoviesInfoCreateActions = createRequestActions<
  { readonly request: CreateMovieInfoCommand },
  { readonly request: CreateMovieInfoCommand },
  { readonly request: CreateMovieInfoCommand; readonly error: RequestError }
>(MOVIES_STATE_DEFINITION.source, MoviesRequestOperation.CreateInfo);
