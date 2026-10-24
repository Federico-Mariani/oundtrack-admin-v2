import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, defer, map, switchMap, throwError, type Observable } from 'rxjs';
import { environment } from '@environments/environment';
import type { ApiResponse } from '@app/core/http/api-response';
import { toApiLocale } from '@app/core/http/api-locale.mapper';
import { toRequestError } from '@app/core/http/http-error.mapper';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { DirectFileUpload } from '@app/core/uploads/direct-file-upload';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { IMAGE_MAX_BYTES, isImageContentType } from '@shared/types/uploads/image-policy';
import type { SupportedLocale } from '@shared/localization/supported-locale';
import type { CategoryManagementPort } from '../../application/ports/category-management.port';
import type { GameCategoryModel } from '../../domain/models/game-category.model';
import type { GameCategoryResponseDto } from '../api/game-category-response.dto';
import type { CategoryIconUploadResponseDto } from '../api/category-icon-upload-response.dto';
import { toGameCategory } from '../mappers/game-category.mapper';
@Injectable()
export class HttpCategoryManagementRepository implements CategoryManagementPort {
  private readonly http = inject(HttpClient);
  private readonly files = inject(UploadFiles);
  private readonly direct = inject(DirectFileUpload);
  private readonly base = environment.apiUrl + '/game-categories';
  saveName(
    id: string | undefined,
    name: string,
    language: SupportedLocale,
  ): Observable<GameCategoryModel> {
    return this.http
      .post<ApiResponse<GameCategoryResponseDto>>(
        id ? `${this.base}/${encodeURIComponent(id)}/info` : this.base,
        { name: name.trim(), language: toApiLocale(language) },
      )
      .pipe(
        map(({ data }) => toGameCategory(data)),
        catchError((error: unknown) => this.failure(error)),
      );
  }
  upload(id: string, fileKey: string): Observable<{ progress: number; key: string }> {
    return defer(() => {
      const file = this.file(fileKey);
      return this.http
        .post<ApiResponse<CategoryIconUploadResponseDto>>(
          `${this.base}/${encodeURIComponent(id)}/icon/upload-url`,
          { contentType: file.type },
        )
        .pipe(
          switchMap(({ data }) =>
            this.direct
              .put(data.url, data.headers, file)
              .pipe(map((progress) => ({ progress, key: data.key }))),
          ),
        );
    }).pipe(catchError((error: unknown) => this.failure(error)));
  }
  complete(id: string, fileKey: string, key: string): Observable<GameCategoryModel> {
    return defer(() =>
      this.http.post<ApiResponse<GameCategoryResponseDto>>(
        `${this.base}/${encodeURIComponent(id)}/icon/complete`,
        { contentType: this.file(fileKey).type, key },
      ),
    ).pipe(
      map(({ data }) => toGameCategory(data)),
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
