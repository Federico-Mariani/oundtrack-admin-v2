import type { Id } from '@shared/types/id';
import type { Observable } from 'rxjs';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { CreateTvSeriesInfoModel } from '../../domain/models/create-tv-series-info.model';
import type { TvSeriesModel } from '../../domain/models/tv-series.model';
import type { TvSeriesDetailModel } from '../../domain/models/tv-series-detail.model';
import type { TvSeriesListQuery } from '../../domain/models/tv-series-list-query.model';
import type { CreateTvSeriesModel } from '../../domain/models/create-tv-series.model';

export interface TvSeriesRepositoryPort {
  createInfo(request: CreateTvSeriesInfoModel): Observable<void>;
  getOne(id: Id): Observable<TvSeriesDetailModel>;
  create(tv: CreateTvSeriesModel): Observable<TvSeriesModel>;
  getAll(query: TvSeriesListQuery): Observable<PageResult<TvSeriesModel>>;
}
