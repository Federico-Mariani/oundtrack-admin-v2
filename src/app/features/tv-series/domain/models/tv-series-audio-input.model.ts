import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { TvSeriesAudioMode } from './tv-series-audio-mode.model';

export interface TvSeriesAudioInputModel {
  readonly mode: TvSeriesAudioMode;
  readonly tvSeriesId: string;
  readonly soundtrackId: string | null;
  readonly externalId: string;
  readonly languages: Array<SupportedLocale>;
  readonly fileKey: string | null;
}
