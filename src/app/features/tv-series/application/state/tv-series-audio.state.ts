import type { TvSeriesSoundtrackTrackModel } from '../../domain/models/tv-series-soundtrack-track.model';
import { TvSeriesAudioPhase } from '../../domain/models/tv-series-audio-phase.model';

export interface TvSeriesAudioState {
  readonly sessionId: string | null;
  readonly track: TvSeriesSoundtrackTrackModel | null;
  readonly soundtrackId: string | null;
  readonly phase: TvSeriesAudioPhase;
  readonly progress: number;
  readonly uploaded: boolean;
  readonly creationUncertain: boolean;
}
export const initialTvSeriesAudioState: TvSeriesAudioState = {
  sessionId: null,
  track: null,
  soundtrackId: null,
  phase: TvSeriesAudioPhase.Ready,
  progress: 0,
  uploaded: false,
  creationUncertain: false,
};
