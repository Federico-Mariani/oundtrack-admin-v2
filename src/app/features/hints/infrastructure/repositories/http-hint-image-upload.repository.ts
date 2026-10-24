import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, defer, map, switchMap, throwError, type Observable } from 'rxjs';
import { environment } from '@environments/environment';
import type { ApiResponse } from '@app/core/http/api-response';
import { toRequestError } from '@app/core/http/http-error.mapper';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { DirectFileUpload } from '@app/core/uploads/direct-file-upload';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { IMAGE_MAX_BYTES, isImageContentType } from '@shared/types/uploads/image-policy';
import type { HintModel } from '../../domain/models/hint.model';
import type { HintResponseDto } from '../api/hint-response.dto';
import type { HintImageUploadResponseDto } from '../api/hint-image-upload-response.dto';
import { toHint } from '../mappers/hint.mapper';
@Injectable({ providedIn: 'root' })
export class HttpHintImageUploadRepository {
  private readonly http = inject(HttpClient);
  private readonly files = inject(UploadFiles);
  private readonly direct = inject(DirectFileUpload);
  upload(hintId: string, fileKey: string): Observable<number> {
    return defer(() => {
      const file = this.validFile(fileKey);
      return this.http
        .post<ApiResponse<HintImageUploadResponseDto>>(this.url(hintId) + '/upload-url', {
          contentType: file.type,
        })
        .pipe(
          switchMap(({ data }) =>
            this.direct
              .put(data.url, data.headers, file)
              .pipe(
                catchError((error: unknown) =>
                  throwError(() =>
                    error instanceof HttpErrorResponse
                      ? error
                      : new HttpErrorResponse({ status: 0 }),
                  ),
                ),
              ),
          ),
        );
    }).pipe(catchError((error: unknown) => this.failure(error)));
  }
  complete(hintId: string, fileKey: string): Observable<HintModel> {
    return defer(() => {
      const file = this.validFile(fileKey);
      return this.http
        .post<ApiResponse<HintResponseDto>>(this.url(hintId) + '/complete', {
          contentType: file.type,
        })
        .pipe(map(({ data }) => toHint(data)));
    }).pipe(catchError((error: unknown) => this.failure(error)));
  }
  private validFile(key: string): File {
    const file = this.files.get(key);
    if (!file || !isImageContentType(file.type) || file.size === 0 || file.size > IMAGE_MAX_BYTES)
      throw new Error('Invalid local image');
    return file;
  }
  private url(id: string): string {
    return environment.apiUrl + '/hints/' + encodeURIComponent(id) + '/image';
  }
  private failure(error: unknown): Observable<never> {
    return throwError(() =>
      error instanceof HttpErrorResponse
        ? toRequestError(error)
        : { code: RequestErrorCode.Validation },
    );
  }
}
