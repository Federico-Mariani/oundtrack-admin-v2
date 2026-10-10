import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { MoviesStoreActionsFacade } from './movies-store-actions.facade';
import { MoviesStoreDataFacade } from './movies-store-data.facade';
import { MoviesStoreErrorStatusesFacade } from './movies-store-error-statuses.facade';
import { MoviesStoreLoadingStatusesFacade } from './movies-store-loading-statuses.facade';

/**
 * Public application API of the Auth state. Presentation, guards and
 * interceptors talk to this facade only; NgRx actions and selectors stay
 * internal to `application/state`.
 */
@Injectable({ providedIn: 'root' })
export class MoviesFacade extends StoreFacade<
  MoviesStoreDataFacade,
  MoviesStoreLoadingStatusesFacade,
  MoviesStoreErrorStatusesFacade,
  MoviesStoreActionsFacade
> {
  constructor() {
    super({
      data: MoviesStoreDataFacade,
      loadingStatuses: MoviesStoreLoadingStatusesFacade,
      errorStatuses: MoviesStoreErrorStatusesFacade,
      actions: MoviesStoreActionsFacade,
    });
  }
}
