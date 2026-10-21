import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { tvSeriesFeature } from '../tv-series.feature';

@Injectable({ providedIn: 'root' })
export class TvSeriesStoreDataFacade {
  private readonly store = inject(Store);

  readonly detail = this.store.selectSignal(tvSeriesFeature.selectDetail);
  readonly query = this.store.selectSignal(tvSeriesFeature.selectQuery);
  readonly total = this.store.selectSignal(tvSeriesFeature.selectTotal);
  readonly tvSeries = this.store.selectSignal(tvSeriesFeature.selectTvSeries);
}
