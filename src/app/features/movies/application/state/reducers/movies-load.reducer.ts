import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import { MoviesLoadActions } from '../actions/movies-load.actions';
import type { MoviesState } from '../movies.state';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { MoviesLoadApiActions } from '../actions/api/movies-load-api.actions';

/** Login lifecycle: only `loginRequest` and, on success, `session` change. */
export const moviesLoadReducer: ReducerTypes<MoviesState, readonly ActionCreator[]>[] = [
  on(MoviesLoadActions.moviesLoadRequested, (state): MoviesState => ({
    ...state,
    loadRequest: pendingRequest(),
  })),
  on(MoviesLoadApiActions.moviesLoaded, (state, { movies }): MoviesState => ({
    ...state,
    movies: [...movies],
    loadRequest: succeededRequest(),
  })),
  on(MoviesLoadApiActions.moviesLoadFailed, (state, { error }): MoviesState => ({
    ...state,
    loadRequest: failedRequest(error),
  })),
];
