import type { Id } from '@shared/types/id';
import type { Observable } from 'rxjs';
import type { PageResult } from '@shared/types/pagination/page-result';
import type { CreateTvSeriesInfoCommand } from '../commands/create-tv-series-info.command';
import type { TvSeriesModel } from '../../domain/models/tv-series.model';
import type { TvSeriesDetailModel } from '../../domain/models/tv-series-detail.model';
import type { TvSeriesListQuery } from '../queries/tv-series-list.query';
import type { CreateTvSeriesCommand } from '../commands/create-tv-series.command';

export interface TvSeriesRepositoryPort {
  createInfo(request: CreateTvSeriesInfoCommand): Observable<void>;
  getOne(id: Id): Observable<TvSeriesDetailModel>;
  create(tv: CreateTvSeriesCommand): Observable<TvSeriesModel>;
  getAll(query: TvSeriesListQuery): Observable<PageResult<TvSeriesModel>>;
}
