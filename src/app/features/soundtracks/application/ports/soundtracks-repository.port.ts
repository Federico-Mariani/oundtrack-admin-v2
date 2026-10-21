import type { SoundtrackOwner } from '../../domain/ownership/soundtrack-owner';
import type { Observable } from 'rxjs';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { SoundtrackModel } from '@shared/types/catalog/soundtrack.model';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';

export interface SoundtracksRepositoryPort {
  create(
    owner: SoundtrackOwner,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<SoundtrackModel>;
  addTrack(
    soundtrackId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<SoundtrackTrackModel>;
  languages(trackId: string, languages: Array<SupportedLocale>): Observable<SoundtrackTrackModel>;
  upload(trackId: string, fileKey: string): Observable<number>;
  complete(trackId: string): Observable<SoundtrackTrackModel>;
}
