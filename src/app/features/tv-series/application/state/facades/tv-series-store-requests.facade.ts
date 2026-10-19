import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createRequestSignals } from '@shared/state/request-signals';
import { tvSeriesFeature } from '../tv-series.feature';

@Injectable({ providedIn: 'root' })
export class TvSeriesStoreRequestsFacade {
  private readonly store = inject(Store);

  readonly audio = createRequestSignals(
    this.store.selectSignal(tvSeriesFeature.selectAudioRequest),
  );
  readonly getAll = createRequestSignals(
    this.store.selectSignal(tvSeriesFeature.selectLoadRequest),
  );

  readonly getById = createRequestSignals(
    this.store.selectSignal(tvSeriesFeature.selectDetailRequest),
  );

  readonly create = createRequestSignals(
    this.store.selectSignal(tvSeriesFeature.selectCreateRequest),
  );

  readonly createInfo = createRequestSignals(
    this.store.selectSignal(tvSeriesFeature.selectCreateInfoRequest),
  );
}
