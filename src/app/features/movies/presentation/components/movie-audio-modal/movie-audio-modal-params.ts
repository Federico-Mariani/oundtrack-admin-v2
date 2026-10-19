import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { MovieAudioMode } from '../../../domain/models/movie-audio-mode.model';
import type { MovieSoundtrackModel } from '../../../domain/models/movie-soundtrack.model';
import type { MovieSoundtrackTrackModel } from '../../../domain/models/movie-soundtrack-track.model';
export interface MovieAudioModalParams {
  readonly mode: MovieAudioMode;
  readonly movieId: string;
  readonly locale: SupportedLocale;
  readonly soundtrack?: MovieSoundtrackModel;
  readonly track?: MovieSoundtrackTrackModel;
}
