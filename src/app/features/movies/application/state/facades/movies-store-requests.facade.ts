import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createRequestSignals } from '@shared/state/request-signals';
import { moviesFeature } from '../movies.feature';

@Injectable({ providedIn: 'root' })
export class MoviesStoreRequestsFacade {
  private readonly store = inject(Store);

  readonly getAll = createRequestSignals(this.store.selectSignal(moviesFeature.selectLoadRequest));

  readonly getById = createRequestSignals(
    this.store.selectSignal(moviesFeature.selectDetailRequest),
  );

  readonly create = createRequestSignals(
    this.store.selectSignal(moviesFeature.selectCreateRequest),
  );

  readonly createInfo = createRequestSignals(
    this.store.selectSignal(moviesFeature.selectCreateInfoRequest),
  );
}
