import { createReducer } from '@ngrx/store';
import { initialAvatarsState } from './avatars.state';
import { avatarsLoadReducer } from './reducers/avatars-load.reducer';
import { avatarSaveReducer } from './reducers/avatar-save.reducer';
export const avatarsReducer = createReducer(
  initialAvatarsState,
  ...avatarsLoadReducer,
  ...avatarSaveReducer,
);
