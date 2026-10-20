import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';
import { SoundtrackEditorPhase } from '../workflows/soundtrack-editor.phase';

export interface SoundtracksAudioState {
  readonly sessionId: string | null;
  readonly track: SoundtrackTrackModel | null;
  readonly soundtrackId: string | null;
  readonly phase: SoundtrackEditorPhase;
  readonly progress: number;
  readonly uploaded: boolean;
  readonly creationUncertain: boolean;
}
export const initialSoundtracksAudioState: SoundtracksAudioState = {
  sessionId: null,
  track: null,
  soundtrackId: null,
  phase: SoundtrackEditorPhase.Ready,
  progress: 0,
  uploaded: false,
  creationUncertain: false,
};
