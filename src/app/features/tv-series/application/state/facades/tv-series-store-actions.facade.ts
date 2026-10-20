import type { Id } from '@shared/types/id';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { TvSeriesInfoCreateActions } from '../actions/tv-series-info-create.actions';
import { TvSeriesDetailActions } from '../actions/tv-series-detail.actions';
import { TvSeriesCreateActions } from '../actions/tv-series-create.actions';
import { TvSeriesGetAllActions } from '../actions/tv-series-get-all.actions';
import type { CreateTvSeriesCommand } from '../../commands/create-tv-series.command';
import type { TvSeriesListQuery } from '../../queries/tv-series-list.query';
import type { CreateTvSeriesInfoCommand } from '../../commands/create-tv-series-info.command';

@Injectable({ providedIn: 'root' })
export class TvSeriesStoreActionsFacade {
  private readonly store = inject(Store);

  createInfo(request: CreateTvSeriesInfoCommand): void {
    this.store.dispatch(TvSeriesInfoCreateActions.requested({ request }));
  }
  resetCreateInfo(): void {
    this.store.dispatch(TvSeriesInfoCreateActions.reset());
  }
  loadDetail(id: Id): void {
    this.store.dispatch(TvSeriesDetailActions.requested({ id }));
  }
  closeDetail(id: Id): void {
    this.store.dispatch(TvSeriesDetailActions.closed({ id }));
  }
  createTvSeries(tvSeries: CreateTvSeriesCommand): void {
    this.store.dispatch(TvSeriesCreateActions.requested({ tvSeries }));
  }
  resetCreateTvSeries(): void {
    this.store.dispatch(TvSeriesCreateActions.reset());
  }
  getAllTvSeries(query: TvSeriesListQuery, debounce = false): void {
    this.store.dispatch(TvSeriesGetAllActions.requested({ query, debounce }));
  }
}
