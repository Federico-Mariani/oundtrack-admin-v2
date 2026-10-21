import { toApiLocale } from '@app/core/http/api-locale.mapper';
import type { ApiResponse } from '@app/core/http/api-response';
import type { Id } from '@shared/types/id';
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, type Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import type { PaginatedApiResponse } from '@app/core/http/paginated-api-response';
import { mapPaginatedResponse } from '@app/core/http/paginated-response.mapper';
import { listHttpParams } from '@app/core/http/list-http-params';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { TvSeriesRepositoryPort } from '../../application/ports/tv-series-repository.port';
import { toRequestError } from '@app/core/http/http-error.mapper';
import type { CreateTvSeriesInfoCommand } from '../../application/commands/create-tv-series-info.command';
import type { TvSeriesInfoResponseDto } from '../api/tv-series-info-response.dto';
import type { TvSeriesDetailModel } from '../../domain/models/tv-series-detail.model';
import type { TvSeriesDetailResponseDto } from '../api/tv-series-detail-response.dto';
import { toTvSeriesDetail } from '../mappers/tv-series-detail.mapper';
import type { CreateTvSeriesCommand } from '../../application/commands/create-tv-series.command';
import type { TvSeriesResponseDto } from '../api/tv-series-response.dto';
import type { TvSeriesModel } from '../../domain/models/tv-series.model';
import { toCreateTvSeriesRequest } from '../mappers/create-tv-series-request.mapper';
import { toTvSeries } from '../mappers/tv-series.mapper';
import type { TvSeriesListQuery } from '../../application/queries/tv-series-list.query';

@Injectable()
export class HttpTvSeriesRepository implements TvSeriesRepositoryPort {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl + '/tv-series';

  createInfo(request: CreateTvSeriesInfoCommand): Observable<void> {
    return this.http
      .post<ApiResponse<TvSeriesInfoResponseDto>>(
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

  getOne(id: Id): Observable<TvSeriesDetailModel> {
    return this.http
      .get<ApiResponse<TvSeriesDetailResponseDto>>(`${this.baseUrl}/${encodeURIComponent(id)}`)
      .pipe(
        map(({ data }) => toTvSeriesDetail(data)),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }

  create(tv: CreateTvSeriesCommand): Observable<TvSeriesModel> {
    return this.http
      .post<ApiResponse<TvSeriesResponseDto>>(this.baseUrl, toCreateTvSeriesRequest(tv))
      .pipe(
        map(({ data }) => toTvSeries(data)),
        catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
      );
  }

  getAll(query: TvSeriesListQuery): Observable<PageResult<TvSeriesModel>> {
    const params = listHttpParams(query, { ...query.filters });
    return this.http.get<PaginatedApiResponse<TvSeriesResponseDto>>(this.baseUrl, { params }).pipe(
      map((response) => mapPaginatedResponse(response, toTvSeries)),
      catchError((error: HttpErrorResponse) => throwError(() => toRequestError(error))),
    );
  }
}
