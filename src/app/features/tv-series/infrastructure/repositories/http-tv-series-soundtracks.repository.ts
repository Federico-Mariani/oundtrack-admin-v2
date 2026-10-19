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
import type { TvSeriesSoundtracksRepositoryPort } from '../../application/ports/tv-series-soundtracks-repository.port';
import type { TvSeriesSoundtrackModel } from '../../domain/models/tv-series-soundtrack.model';
import type { TvSeriesSoundtrackResponseDto } from '../api/tv-series-soundtrack-response.dto';
import { toTvSeriesSoundtrack } from '../mappers/tv-series-soundtrack.mapper';
import type { TvSeriesSoundtrackTrackModel } from '../../domain/models/tv-series-soundtrack-track.model';
import type { TvSeriesSoundtrackTrackResponseDto } from '../api/tv-series-soundtrack-track-response.dto';
import type { TrackUploadResponseDto } from '../api/track-upload-response.dto';
import { toTvSeriesSoundtrackTrack } from '../mappers/tv-series-soundtrack-track.mapper';

@Injectable()
export class HttpTvSeriesSoundtracksRepository implements TvSeriesSoundtracksRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly direct = inject(DirectAudioUpload);
  private readonly files = inject(UploadFiles);
  private readonly baseUrl = environment.apiUrl + '/soundtracks';

  create(
    tvSeriesId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<TvSeriesSoundtrackModel> {
    return this.http
      .post<ApiResponse<TvSeriesSoundtrackResponseDto>>(this.baseUrl, {
        ownerType: 'tv-series',
        ownerId: tvSeriesId,
        trackExternalId: externalId,
        languages: toApiLocales(languages),
      })
      .pipe(
        map(({ data }) => toTvSeriesSoundtrack(data)),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }
  addTrack(
    soundtrackId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<TvSeriesSoundtrackTrackModel> {
    return this.track(
      this.http.post<ApiResponse<TvSeriesSoundtrackTrackResponseDto>>(
        `${this.baseUrl}/${encodeURIComponent(soundtrackId)}/tracks`,
        { externalId, languages: toApiLocales(languages) },
      ),
    );
  }
  languages(
    trackId: string,
    languages: Array<SupportedLocale>,
  ): Observable<TvSeriesSoundtrackTrackModel> {
    return this.track(
      this.http.patch<ApiResponse<TvSeriesSoundtrackTrackResponseDto>>(
        `${this.trackUrl(trackId)}/languages`,
        { languages: toApiLocales(languages) },
      ),
    );
  }
  complete(trackId: string): Observable<TvSeriesSoundtrackTrackModel> {
    return this.track(
      this.http.post<ApiResponse<TvSeriesSoundtrackTrackResponseDto>>(
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
    response: Observable<ApiResponse<TvSeriesSoundtrackTrackResponseDto>>,
  ): Observable<TvSeriesSoundtrackTrackModel> {
    return response.pipe(
      map(({ data }) => toTvSeriesSoundtrackTrack(data)),
      catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
    );
  }
}
