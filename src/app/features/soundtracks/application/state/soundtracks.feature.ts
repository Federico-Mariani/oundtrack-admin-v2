import { SOUNDTRACKS_STATE_DEFINITION } from './soundtracks-state-definition';
import { createFeature } from '@ngrx/store';
import { soundtracksReducer } from './soundtracks.reducer';

export const SOUNDTRACKS_FEATURE_KEY = SOUNDTRACKS_STATE_DEFINITION.key;

export const soundtracksFeature = createFeature({
  name: SOUNDTRACKS_FEATURE_KEY,
  reducer: soundtracksReducer,
});
