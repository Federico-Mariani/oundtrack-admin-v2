import { moviesCreateReducer } from './reducers/movies-create.reducer';
import { createReducer } from '@ngrx/store';
import { initialMoviesState } from './movies.state';
import { moviesLoadReducer } from './reducers/movies-load.reducer';

/**
 * Root reducer of the single Movies feature state, composed from one
 * micro-reducer per capability. Each capability only touches its own slice.
 */
export const moviesReducer = createReducer(
  initialMoviesState,
  ...moviesLoadReducer,
  ...moviesCreateReducer,
);
