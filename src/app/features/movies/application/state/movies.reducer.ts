import { moviesInfoCreateReducer } from './reducers/movies-info-create.reducer';
import { moviesCreateReducer } from './reducers/movies-create.reducer';
import { moviesDetailReducer } from './reducers/movies-detail.reducer';
import { createReducer } from '@ngrx/store';
import { initialMoviesState } from './movies.state';
import { moviesGetAllReducer } from './reducers/movies-get-all.reducer';

/**
 * Root reducer of the single Movies feature state, composed from one
 * micro-reducer per capability. Each capability only touches its own slice.
 */
export const moviesReducer = createReducer(
  initialMoviesState,
  ...moviesGetAllReducer,
  ...moviesCreateReducer,
  ...moviesDetailReducer,
  ...moviesInfoCreateReducer,
);
