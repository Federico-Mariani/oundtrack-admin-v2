import { HttpHintImageUploadRepository } from './http-hint-image-upload.repository';
import { isImageHint } from '../../domain/values/hint-image-policy';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError, type Observable } from 'rxjs';
import { environment } from '@environments/environment';
import type { ApiResponse } from '@app/core/http/api-response';
import { toApiLocale } from '@app/core/http/api-locale.mapper';
import { toRequestError } from '@app/core/http/http-error.mapper';
import { RequestErrorCode } from '@shared/state/request/request-error';
import type { HintModel } from '../../domain/models/hint.model';
import type { HintsRepositoryPort } from '../../application/ports/hints-repository.port';
import type { SaveHintCommand } from '../../application/commands/save-hint.command';
import { HintEditorMode } from '../../application/workflows/hint-editor.mode';
import type { HintResponseDto } from '../api/hint-response.dto';
import { toHint } from '../mappers/hint.mapper';
@Injectable()
export class HttpHintsRepository implements HintsRepositoryPort {
  private readonly images = inject(HttpHintImageUploadRepository);
  uploadImage(id: string, fileKey: string): Observable<number> {
    return this.images.upload(id, fileKey);
  }
  completeImage(id: string, fileKey: string): Observable<HintModel> {
    return this.images.complete(id, fileKey);
  }
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/hints';
  getByOwner(ownerId: string): Observable<ReadonlyArray<HintModel>> {
    return this.http
      .get<ApiResponse<ReadonlyArray<HintResponseDto>>>(
        `${this.baseUrl}/owner/${encodeURIComponent(ownerId)}`,
      )
      .pipe(
        map(({ data }) => data.map(toHint)),
        catchError((error: unknown) => this.failure(error)),
      );
  }
  save(command: SaveHintCommand): Observable<HintModel | null> {
    if (command.mode === HintEditorMode.Delete) {
      return this.http.delete<null>(`${this.baseUrl}/${encodeURIComponent(command.hintId)}`).pipe(
        map(() => null),
        catchError((error: unknown) => this.failure(error)),
      );
    }
    if (command.mode === HintEditorMode.Image)
      return throwError(() => ({ code: RequestErrorCode.Validation }));
    const content = {
      language: toApiLocale(command.language),
      ...(command.text !== undefined ? { text: command.text.trim() } : {}),
    };
    if (
      command.mode === HintEditorMode.Create &&
      !isImageHint(command.type) &&
      !command.text?.trim()
    )
      return throwError(() => ({ code: RequestErrorCode.Validation }));
    let request: Observable<ApiResponse<HintResponseDto>>;
    if (command.mode === HintEditorMode.Translate) {
      request = this.http.post<ApiResponse<HintResponseDto>>(
        `${this.baseUrl}/${encodeURIComponent(command.hintId)}/info`,
        content,
      );
    } else {
      const body = {
        ...content,
        type: command.type,
      };
      request =
        command.mode === HintEditorMode.Create
          ? this.http.post<ApiResponse<HintResponseDto>>(this.baseUrl, {
              ...body,
              ownerId: command.owner.id,
              ownerType: command.owner.type,
            })
          : this.http.patch<ApiResponse<HintResponseDto>>(
              `${this.baseUrl}/${encodeURIComponent(command.hintId)}`,
              content,
            );
    }
    return request.pipe(
      map(({ data }) => toHint(data)),
      catchError((error: unknown) => this.failure(error)),
    );
  }
  private failure(error: unknown): Observable<never> {
    return throwError(() =>
      error instanceof HttpErrorResponse
        ? toRequestError(error)
        : { code: RequestErrorCode.Unknown },
    );
  }
}
