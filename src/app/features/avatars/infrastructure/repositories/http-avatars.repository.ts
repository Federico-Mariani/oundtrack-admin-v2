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
import type { AvatarsRepositoryPort } from '../../application/ports/avatars-repository.port';
import type { AvatarModel } from '../../domain/models/avatar.model';
import type { AvatarResponseDto } from '../api/avatar-response.dto';
import type { AvatarUploadResponseDto } from '../api/avatar-upload-response.dto';
import { toAvatar } from '../mappers/avatar.mapper';
@Injectable()
export class HttpAvatarsRepository implements AvatarsRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly files = inject(UploadFiles);
  private readonly direct = inject(DirectFileUpload);
  private readonly base = environment.apiUrl + '/avatars';
  getAll(): Observable<ReadonlyArray<AvatarModel>> {
    return this.http.get<ApiResponse<ReadonlyArray<AvatarResponseDto>>>(this.base).pipe(
      map(({ data }) => data.map(toAvatar)),
      catchError((error: unknown) => this.failure(error)),
    );
  }
  upload(fileKey: string): Observable<{ progress: number; key: string }> {
    return defer(() => {
      const file = this.file(fileKey);
      return this.http
        .post<ApiResponse<AvatarUploadResponseDto>>(`${this.base}/upload-url`, {
          contentType: file.type,
        })
        .pipe(
          switchMap(({ data }) =>
            this.direct
              .put(data.url, data.headers, file)
              .pipe(map((progress) => ({ progress, key: data.key }))),
          ),
        );
    }).pipe(catchError((error: unknown) => this.failure(error)));
  }
  complete(fileKey: string, key: string, avatarId?: string): Observable<AvatarModel> {
    return defer(() =>
      this.http.post<ApiResponse<AvatarResponseDto>>(
        avatarId
          ? `${this.base}/${encodeURIComponent(avatarId)}/upload/complete`
          : `${this.base}/upload/complete`,
        { contentType: this.file(fileKey).type, key },
      ),
    ).pipe(
      map(({ data }) => toAvatar(data)),
      catchError((error: unknown) => this.failure(error)),
    );
  }
  private file(key: string): File {
    const file = this.files.get(key);
    if (!file || !isImageContentType(file.type) || !file.size || file.size > IMAGE_MAX_BYTES)
      throw new Error('Invalid local image');
    return file;
  }
  private failure(error: unknown): Observable<never> {
    return throwError(() =>
      error instanceof HttpErrorResponse
        ? toRequestError(error)
        : { code: RequestErrorCode.Validation },
    );
  }
}
