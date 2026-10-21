import { HINT_COSTS } from '../../domain/values/hint-cost';
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
import { HINT_ICONS } from '../config/hint-icon-keys';
import type { HintResponseDto } from '../api/hint-response.dto';
import { toHint } from '../mappers/hint.mapper';
@Injectable()
export class HttpHintsRepository implements HintsRepositoryPort {
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
    const content = { language: toApiLocale(command.language), text: command.text.trim() };
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
        cost: HINT_COSTS[command.type],
        icon: HINT_ICONS[command.type],
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
              body,
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
