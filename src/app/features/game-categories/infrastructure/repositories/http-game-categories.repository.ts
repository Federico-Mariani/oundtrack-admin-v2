import type { SetOwnerCategoriesCommand } from '../../application/commands/set-owner-categories.command';
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { toRequestError } from '../../../../core/http/http-error.mapper';
import type { GameCategoriesRepositoryPort } from '../../application/ports/game-categories-repository.port';
import type { GameCategoryModel } from '../../domain/models/game-category.model';
import type { ApiResponse } from '@app/core/http/api-response';
import { toGameCategory } from '../mappers/game-category.mapper';
import type { GameCategoryResponseDto } from '../api/game-category-response.dto';

@Injectable()
export class HttpGameCategoriesRepository implements GameCategoriesRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/game-categories';

  setForOwner(command: SetOwnerCategoriesCommand): Observable<void> {
    return this.http
      .post<unknown>(this.baseUrl + '/set-for-owner', {
        ownerId: command.owner.id,
        ownerType: command.owner.type,
        gameCategoryIds: command.categoryIds,
      })
      .pipe(
        map(() => undefined),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }
  getAll(): Observable<Array<GameCategoryModel>> {
    return this.http.get<ApiResponse<Array<GameCategoryResponseDto>>>(this.baseUrl).pipe(
      map(({ data }) => data.map((category) => toGameCategory(category))),
      catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
    );
  }
}
