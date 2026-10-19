import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { TvSeriesAudioMode } from '../../../domain/models/tv-series-audio-mode.model';
import type { TvSeriesSoundtrackModel } from '../../../domain/models/tv-series-soundtrack.model';
import type { TvSeriesSoundtrackTrackModel } from '../../../domain/models/tv-series-soundtrack-track.model';

export interface TvSeriesAudioModalParams {
  readonly mode: TvSeriesAudioMode;
  readonly tvSeriesId: string;
  readonly locale: SupportedLocale;
  readonly soundtrack?: TvSeriesSoundtrackModel;
  readonly track?: TvSeriesSoundtrackTrackModel;
}
