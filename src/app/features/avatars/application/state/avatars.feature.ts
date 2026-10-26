import { createFeature } from '@ngrx/store';
import { avatarsReducer } from './avatars.reducer';
import { AVATARS_STATE_DEFINITION } from './avatars-state-definition';
export const avatarsFeature = createFeature({
  name: AVATARS_STATE_DEFINITION.key,
  reducer: avatarsReducer,
});
