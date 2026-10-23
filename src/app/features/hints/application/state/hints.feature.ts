import { createFeature } from '@ngrx/store';
import { HINTS_STATE_DEFINITION } from './hints-state-definition';
import { hintsReducer } from './hints.reducer';
export const hintsFeature = createFeature({
  name: HINTS_STATE_DEFINITION.key,
  reducer: hintsReducer,
});
