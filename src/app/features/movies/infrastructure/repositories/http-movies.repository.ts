import type { CreateMovieModel } from '../../domain/models/create-movie.model';
import type { ApiResponse } from '@app/core/http/api-response';
import { toCreateMovieRequest } from '../mappers/create-movie-request.mapper';
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import type { PaginatedApiResponse } from '@app/core/http/paginated-api-response';
import { mapPaginatedResponse } from '@app/core/http/paginated-response.mapper';
import { listHttpParams } from '@app/core/http/list-http-params';
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

  create(movie: CreateMovieModel): Observable<MovieModel> {
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
