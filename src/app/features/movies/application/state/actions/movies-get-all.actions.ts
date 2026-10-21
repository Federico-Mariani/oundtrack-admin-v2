import { MoviesRequestOperation } from '../movies-request-operation';
import { MOVIES_STATE_DEFINITION } from '../movies-state-definition';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { MoviesListQuery } from '../../queries/movies-list.query';
import type { MovieModel } from '../../../domain/models/movie.model';

export const MoviesGetAllActions = createRequestActions<
  {
    readonly query: MoviesListQuery;
    readonly debounce?: boolean;
  },
  {
    readonly result: PageResult<MovieModel>;
    readonly query: MoviesListQuery;
  },
  {
    readonly error: RequestError;
    readonly query: MoviesListQuery;
  }
>(MOVIES_STATE_DEFINITION.source, MoviesRequestOperation.GetAll);
