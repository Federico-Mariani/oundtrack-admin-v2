import { MOVIES_STATE_DEFINITION } from './movies-state-definition';
import { createFeature } from '@ngrx/store';
import { moviesReducer } from './movies.reducer';

export const MOVIES_FEATURE_KEY = MOVIES_STATE_DEFINITION.key;

export const moviesFeature = createFeature({
  name: MOVIES_FEATURE_KEY,
  reducer: moviesReducer,
});
