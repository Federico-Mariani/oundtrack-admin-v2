import { createReducer } from '@ngrx/store';
import { initialSoundtracksState } from './soundtracks.state';
import { soundtracksAudioReducer } from './reducers/soundtracks-audio.reducer';
export const soundtracksReducer = createReducer(
  initialSoundtracksState,
  ...soundtracksAudioReducer,
);
