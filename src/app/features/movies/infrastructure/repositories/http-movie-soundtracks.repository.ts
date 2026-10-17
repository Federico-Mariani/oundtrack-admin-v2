import { RequestErrorCode } from '@shared/state/request/request-error';
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, defer, map, switchMap, throwError, type Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { toApiLocales } from '@app/core/http/api-locale.mapper';
import type { ApiResponse } from '@app/core/http/api-response';
import { toRequestError } from '@app/core/http/http-error.mapper';
import { DirectAudioUpload } from '@app/core/uploads/direct-audio-upload';
import { UploadFiles } from '@app/core/uploads/upload-files';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { MovieSoundtracksRepositoryPort } from '../../application/ports/movie-soundtracks-repository.port';
import type { MovieSoundtrackModel } from '../../domain/models/movie-soundtrack.model';
import type { MovieSoundtrackTrackModel } from '../../domain/models/movie-soundtrack-track.model';
import type { MovieSoundtrackTrackResponseDto } from '../api/movie-soundtrack-track-response.dto';
import type { MovieSoundtrackResponseDto } from '../api/movie-soundtrack-response.dto';
import type { TrackUploadResponseDto } from '../api/track-upload-response.dto';
import { toMovieSoundtrackTrack } from '../mappers/movie-soundtrack-track.mapper';
import { toMovieSoundtrack } from '../mappers/movie-soundtrack.mapper';
@Injectable()
export class HttpMovieSoundtracksRepository implements MovieSoundtracksRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly direct = inject(DirectAudioUpload);
  private readonly files = inject(UploadFiles);
  private readonly baseUrl = environment.apiUrl + '/soundtracks';
  create(
    movieId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<MovieSoundtrackModel> {
    return this.http
      .post<ApiResponse<MovieSoundtrackResponseDto>>(this.baseUrl, {
        ownerType: 'movie',
        ownerId: movieId,
        trackExternalId: externalId,
        languages: toApiLocales(languages),
      })
      .pipe(
        map(({ data }) => toMovieSoundtrack(data)),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }
  addTrack(
    soundtrackId: string,
    externalId: string,
    languages: Array<SupportedLocale>,
  ): Observable<MovieSoundtrackTrackModel> {
    return this.track(
      this.http.post<ApiResponse<MovieSoundtrackTrackResponseDto>>(
        `${this.baseUrl}/${encodeURIComponent(soundtrackId)}/tracks`,
        { externalId, languages: toApiLocales(languages) },
      ),
    );
  }
  languages(
    trackId: string,
    languages: Array<SupportedLocale>,
  ): Observable<MovieSoundtrackTrackModel> {
    return this.track(
      this.http.patch<ApiResponse<MovieSoundtrackTrackResponseDto>>(
        `${this.trackUrl(trackId)}/languages`,
        { languages: toApiLocales(languages) },
      ),
    );
  }
  complete(trackId: string): Observable<MovieSoundtrackTrackModel> {
    return this.track(
      this.http.post<ApiResponse<MovieSoundtrackTrackResponseDto>>(
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
    response: Observable<ApiResponse<MovieSoundtrackTrackResponseDto>>,
  ): Observable<MovieSoundtrackTrackModel> {
    return response.pipe(
      map(({ data }) => toMovieSoundtrackTrack(data)),
      catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
    );
  }
}
