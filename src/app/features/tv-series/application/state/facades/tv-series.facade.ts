import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { TvSeriesStoreActionsFacade } from './tv-series-store-actions.facade';
import { TvSeriesStoreDataFacade } from './tv-series-store-data.facade';
import { TvSeriesStoreRequestsFacade } from './tv-series-store-requests.facade';

@Injectable({ providedIn: 'root' })
export class TvSeriesFacade extends StoreFacade<
  TvSeriesStoreDataFacade,
  TvSeriesStoreRequestsFacade,
  TvSeriesStoreActionsFacade
> {
  constructor() {
    super({
      data: TvSeriesStoreDataFacade,
      requests: TvSeriesStoreRequestsFacade,
      actions: TvSeriesStoreActionsFacade,
    });
  }
}
