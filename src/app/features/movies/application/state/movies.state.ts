import type { RequestState } from '@shared/state/request/request-state';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { MovieModel } from '../../domain/models/movie.model';
import type { RequestError } from '@shared/state/request/request-error';

export interface MoviesState {
  readonly movies: MovieModel[];
  readonly loadRequest: RequestState<RequestError>;
}

export const initialAuthState: MoviesState = {
  movies: [],
  loadRequest: idleRequest(),
};
