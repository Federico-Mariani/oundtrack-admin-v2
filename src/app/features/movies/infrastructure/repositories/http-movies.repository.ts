import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import type { PaginatedApiResponse } from '@app/core/http/paginated-api-response';
import { mapPaginatedResponse } from '@app/core/http/paginated-response.mapper';
import { listHttpParams } from '@app/core/http/list-http-params';
import { toApiLocale } from '@app/core/http/api-locale.mapper';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { MoviesListQuery } from '../../domain/models/movies-list-query.model';
import type { MoviesRepositoryPort } from '../../application/ports/movies-repository.port';
import type { MovieResponseDto } from '../api/movie-response.dto';
import { toMovie } from '../mappers/movie.mapper';
import type { MovieModel } from '../../domain/models/movie.model';
import { toRequestError } from '../../../../core/http/http-error.mapper';

@Injectable()
export class HttpMoviesRepository implements MoviesRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/movies';

  getAll(query: MoviesListQuery): Observable<PageResult<MovieModel>> {
    const params = listHttpParams(query, {
      ...query.filters,
      infoLanguage: query.filters.infoLanguage
        ? toApiLocale(query.filters.infoLanguage)
        : undefined,
    });
    return this.http.get<PaginatedApiResponse<MovieResponseDto>>(this.baseUrl, { params }).pipe(
      map((response) => mapPaginatedResponse(response, toMovie)),
      catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
    );
  }
}
