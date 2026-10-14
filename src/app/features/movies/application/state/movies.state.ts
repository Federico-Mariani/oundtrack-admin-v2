import {
  DEFAULT_MOVIES_LIST_QUERY,
  type MoviesListQuery,
} from '../../domain/models/movies-list-query.model';
import type { RequestState } from '@shared/state/request/request-state';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { MovieModel } from '../../domain/models/movie.model';
import type { RequestError } from '@shared/state/request/request-error';

export interface MoviesState {
  readonly movies: readonly MovieModel[];
  readonly query: MoviesListQuery;
  readonly total: number;
  readonly createRequest: RequestState<RequestError>;
  readonly loadRequest: RequestState<RequestError>;
}

export const initialMoviesState: MoviesState = {
  movies: [],
  query: DEFAULT_MOVIES_LIST_QUERY,
  total: 0,
  loadRequest: idleRequest(),
  createRequest: idleRequest(),
};
