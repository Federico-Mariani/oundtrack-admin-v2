import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { CreateMovieInfoModel } from '../../../domain/models/create-movie-info.model';

export const MoviesInfoCreateActions = createRequestActions<
  { readonly request: CreateMovieInfoModel },
  { readonly request: CreateMovieInfoModel },
  { readonly request: CreateMovieInfoModel; readonly error: RequestError }
>('Movies', 'Create Info');
