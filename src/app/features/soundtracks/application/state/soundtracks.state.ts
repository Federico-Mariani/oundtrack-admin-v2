import type { RequestState } from '@shared/state/request/request-state';
import type { RequestError } from '@shared/state/request/request-error';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import {
  initialSoundtracksAudioState,
  type SoundtracksAudioState,
} from './soundtracks-audio.state';
export interface SoundtracksState {
  readonly audio: SoundtracksAudioState;
  readonly audioRequest: RequestState<RequestError>;
}
export const initialSoundtracksState: SoundtracksState = {
  audio: initialSoundtracksAudioState,
  audioRequest: idleRequest(),
};
