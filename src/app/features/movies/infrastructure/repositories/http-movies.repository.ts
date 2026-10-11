import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import type { ApiResponse } from '@app/core/http/api-response';
import type { MoviesRepositoryPort } from '../../application/ports/movies-repository.port';
import type { MovieResponseDto } from '../api/movie-response.dto';
import { toMovie } from '../mappers/movie.mapper';
import type { MovieModel } from '../../domain/models/movie.model';
import { toRequestError } from '../../../../core/http/http-error.mapper';

@Injectable()
export class HttpMoviesRepository implements MoviesRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/movies';

  getAll(): Observable<MovieModel[]> {
    return this.http.get<ApiResponse<MovieResponseDto[]>>(this.baseUrl).pipe(
      map(({ data }) => data.map((item) => toMovie(item))),
      catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
    );
  }
}
