import type { CreateMovieInfoCommand } from '../../application/commands/create-movie-info.command';
import { toApiLocale } from '@app/core/http/api-locale.mapper';
import type { CreateMovieCommand } from '../../application/commands/create-movie.command';
import type { ApiResponse } from '@app/core/http/api-response';
import { toCreateMovieRequest } from '../mappers/create-movie-request.mapper';
import type { Id } from '@shared/types/id';
import type { MovieDetailModel } from '../../domain/models/movie-detail.model';
import type { MovieDetailResponseDto } from '../api/movie-detail-response.dto';
import { toMovieDetail } from '../mappers/movie-detail.mapper';
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import type { PaginatedApiResponse } from '@app/core/http/paginated-api-response';
import { mapPaginatedResponse } from '@app/core/http/paginated-response.mapper';
import { listHttpParams } from '@app/core/http/list-http-params';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { MoviesListQuery } from '../../application/queries/movies-list.query';
import type { MoviesRepositoryPort } from '../../application/ports/movies-repository.port';
import type { MovieResponseDto } from '../api/movie-response.dto';
import { toMovie } from '../mappers/movie.mapper';
import type { MovieModel } from '../../domain/models/movie.model';
import { toRequestError } from '@app/core/http/http-error.mapper';
import type { MovieInfoResponseDto } from '../api/movie-info-response.dto';

@Injectable()
export class HttpMoviesRepository implements MoviesRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/movies';

  createInfo(request: CreateMovieInfoCommand): Observable<void> {
    return this.http
      .post<ApiResponse<MovieInfoResponseDto>>(
        `${this.baseUrl}/${encodeURIComponent(request.id)}/info`,
        {
          language: toApiLocale(request.language),
        },
      )
      .pipe(
        map(() => undefined),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }

  getOne(id: Id): Observable<MovieDetailModel> {
    return this.http
      .get<ApiResponse<MovieDetailResponseDto>>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(
        map(({ data }) => toMovieDetail(data)),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }

  create(movie: CreateMovieCommand): Observable<MovieModel> {
    return this.http
      .post<ApiResponse<MovieResponseDto>>(this.baseUrl, toCreateMovieRequest(movie))
      .pipe(
        map(({ data }) => toMovie(data)),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }

  getAll(query: MoviesListQuery): Observable<PageResult<MovieModel>> {
    const params = listHttpParams(query, { ...query.filters });
    return this.http.get<PaginatedApiResponse<MovieResponseDto>>(this.baseUrl, { params }).pipe(
      map((response) => mapPaginatedResponse(response, toMovie)),
      catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
    );
  }
}
