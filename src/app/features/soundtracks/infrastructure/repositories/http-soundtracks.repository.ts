import type { SoundtrackOwner } from '../../domain/ownership/soundtrack-owner';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, defer, map, type Observable, switchMap, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { toApiLocales } from '@app/core/http/api-locale.mapper';
import type { ApiResponse } from '@app/core/http/api-response';
import { toRequestError } from '@app/core/http/http-error.mapper';
import { DirectAudioUpload } from '@app/core/uploads/direct-audio-upload';
import { UploadFiles } from '@app/core/uploads/upload-files';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { SoundtracksRepositoryPort } from '../../application/ports/soundtracks-repository.port';
import type { SoundtrackModel } from '@shared/types/catalog/soundtrack.model';
import type { SoundtrackResponseDto } from '@app/core/catalog/api/soundtrack-response.dto';
import { toSoundtrack } from '@app/core/catalog/mappers/soundtrack.mapper';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';
import type { SoundtrackTrackResponseDto } from '@app/core/catalog/api/soundtrack-track-response.dto';
import type { TrackUploadResponseDto } from '../api/track-upload-response.dto';
import { toSoundtrackTrack } from '@app/core/catalog/mappers/soundtrack-track.mapper';

@Injectable()
export class HttpSoundtracksRepository implements SoundtracksRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly direct = inject(DirectAudioUpload);
  private readonly files = inject(UploadFiles);
  private readonly baseUrl = environment.apiUrl + '/soundtracks';

  create(
    owner: SoundtrackOwner,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<SoundtrackModel> {
    return this.http
      .post<ApiResponse<SoundtrackResponseDto>>(this.baseUrl, {
        ownerType: owner.type,
        ownerId: owner.id,
        trackExternalId: externalId,
        languages: toApiLocales(languages),
      })
      .pipe(
        map(({ data }) => toSoundtrack(data)),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }
  addTrack(
    soundtrackId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<SoundtrackTrackModel> {
    return this.track(
      this.http.post<ApiResponse<SoundtrackTrackResponseDto>>(
        `${this.baseUrl}/${encodeURIComponent(soundtrackId)}/tracks`,
        { externalId, languages: toApiLocales(languages) },
      ),
    );
  }
  languages(trackId: string, languages: Array<SupportedLocale>): Observable<SoundtrackTrackModel> {
    return this.track(
      this.http.patch<ApiResponse<SoundtrackTrackResponseDto>>(
        `${this.trackUrl(trackId)}/languages`,
        { languages: toApiLocales(languages) },
      ),
    );
  }
  complete(trackId: string): Observable<SoundtrackTrackModel> {
    return this.track(
      this.http.post<ApiResponse<SoundtrackTrackResponseDto>>(
        `${this.trackUrl(trackId)}/upload/complete`,
        {},
      ),
    );
  }
  upload(trackId: string, fileKey: string): Observable<number> {
    return defer(() => {
      const file = this.files.get(fileKey);
      if (!file) {
        return throwError(() => ({ code: RequestErrorCode.Validation }));
      }
      return this.http
        .post<ApiResponse<TrackUploadResponseDto>>(`${this.trackUrl(trackId)}/upload-url`, {})
        .pipe(
          catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
          switchMap(({ data }) =>
            this.direct
              .put(data.url, data.headers, file)
              .pipe(catchError(() => throwError(() => ({ code: RequestErrorCode.Network })))),
          ),
        );
    });
  }
  private trackUrl(id: string): string {
    return `${this.baseUrl}/tracks/${encodeURIComponent(id)}`;
  }
  private track(
    response: Observable<ApiResponse<SoundtrackTrackResponseDto>>,
  ): Observable<SoundtrackTrackModel> {
    return response.pipe(
      map(({ data }) => toSoundtrackTrack(data)),
      catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
    );
  }
}
