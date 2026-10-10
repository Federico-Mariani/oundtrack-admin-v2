import { createReducer } from '@ngrx/store';
import { initialAuthState } from './movies.state';
import { moviesLoadReducer } from './reducers/movies-load.reducer';

/**
 * Root reducer of the single Auth feature state, composed from one
 * micro-reducer per capability. Each capability only touches its own slice.
 */
export const moviesReducer = createReducer(initialAuthState, ...moviesLoadReducer);
