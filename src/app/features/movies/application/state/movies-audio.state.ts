import type { MovieSoundtrackTrackModel } from '../../domain/models/movie-soundtrack-track.model';
import { MovieAudioPhase } from '../../domain/models/movie-audio-phase.model';
export interface MoviesAudioState {
  readonly sessionId: string | null;
  readonly track: MovieSoundtrackTrackModel | null;
  readonly soundtrackId: string | null;
  readonly phase: MovieAudioPhase;
  readonly progress: number;
  readonly uploaded: boolean;
  readonly creationUncertain: boolean;
}
export const initialMoviesAudioState: MoviesAudioState = {
  sessionId: null,
  track: null,
  soundtrackId: null,
  phase: MovieAudioPhase.Ready,
  progress: 0,
  uploaded: false,
  creationUncertain: false,
};
