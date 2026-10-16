import { createFeature } from '@ngrx/store';
import { moviesReducer } from './movies.reducer';

export const MOVIES_FEATURE_KEY = 'movies';

export const moviesFeature = createFeature({
  name: MOVIES_FEATURE_KEY,
  reducer: moviesReducer,
});
