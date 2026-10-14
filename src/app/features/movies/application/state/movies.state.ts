import {
  DEFAULT_MOVIES_LIST_QUERY,
  type MoviesListQuery,
} from '../../domain/models/movies-list-query.model';
import type { RequestState } from '@shared/state/request/request-state';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { MovieModel } from '../../domain/models/movie.model';
import type { RequestError } from '@shared/state/request/request-error';

import type { MovieDetailModel } from '../../domain/models/movie-detail.model';
import type { Id } from '@shared/types/id';

export interface MoviesState {
  readonly detailId: Id | null;
  readonly detail: MovieDetailModel | null;
  readonly detailRequest: RequestState<RequestError>;
  readonly movies: readonly MovieModel[];
  readonly query: MoviesListQuery;
  readonly total: number;
  readonly createRequest: RequestState<RequestError>;
  readonly loadRequest: RequestState<RequestError>;
}

export const initialMoviesState: MoviesState = {
  detailId: null,
  detail: null,
  detailRequest: idleRequest(),
  movies: [],
  query: DEFAULT_MOVIES_LIST_QUERY,
  total: 0,
  loadRequest: idleRequest(),
  createRequest: idleRequest(),
};
