import { Injectable } from '@angular/core';
import { StoreFacade } from '@shared/state/store-facade';
import { MoviesStoreActionsFacade } from './movies-store-actions.facade';
import { MoviesStoreDataFacade } from './movies-store-data.facade';
import { MoviesStoreRequestsFacade } from './movies-store-requests.facade';

@Injectable({ providedIn: 'root' })
export class MoviesFacade extends StoreFacade<
  MoviesStoreDataFacade,
  MoviesStoreRequestsFacade,
  MoviesStoreActionsFacade
> {
  constructor() {
    super({
      data: MoviesStoreDataFacade,
      requests: MoviesStoreRequestsFacade,
      actions: MoviesStoreActionsFacade,
    });
  }
}
