import type { Observable } from 'rxjs';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { TvSeriesSoundtrackModel } from '../../domain/models/tv-series-soundtrack.model';
import type { TvSeriesSoundtrackTrackModel } from '../../domain/models/tv-series-soundtrack-track.model';

export interface TvSeriesSoundtracksRepositoryPort {
  create(
    tvSeriesId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<TvSeriesSoundtrackModel>;
  addTrack(
    soundtrackId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<TvSeriesSoundtrackTrackModel>;
  languages(
    trackId: string,
    languages: Array<SupportedLocale>,
  ): Observable<TvSeriesSoundtrackTrackModel>;
  upload(trackId: string, fileKey: string): Observable<number>;
  complete(trackId: string): Observable<TvSeriesSoundtrackTrackModel>;
}
