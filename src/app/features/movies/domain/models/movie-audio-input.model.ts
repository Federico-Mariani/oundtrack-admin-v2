import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { MovieAudioMode } from './movie-audio-mode.model';
export interface MovieAudioInputModel {
  readonly mode: MovieAudioMode;
  readonly movieId: string;
  readonly soundtrackId: string | null;
  readonly externalId: string;
  readonly languages: Array<SupportedLocale>;
  readonly fileKey: string | null;
}
