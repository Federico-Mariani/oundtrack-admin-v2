import type { Observable } from 'rxjs';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { MovieSoundtrackModel } from '../../domain/models/movie-soundtrack.model';
import type { MovieSoundtrackTrackModel } from '../../domain/models/movie-soundtrack-track.model';
export interface MovieSoundtracksRepositoryPort {
  create(
    movieId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<MovieSoundtrackModel>;
  addTrack(
    soundtrackId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<MovieSoundtrackTrackModel>;
  languages(
    trackId: string,
    languages: Array<SupportedLocale>,
  ): Observable<MovieSoundtrackTrackModel>;
  upload(trackId: string, fileKey: string): Observable<number>;
  complete(trackId: string): Observable<MovieSoundtrackTrackModel>;
}
