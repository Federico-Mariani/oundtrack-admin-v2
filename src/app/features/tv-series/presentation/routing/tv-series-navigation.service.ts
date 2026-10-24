import { inject, Injectable } from '@angular/core';
import { type NavigationExtras, type Params, Router } from '@angular/router';
import { TV_SERIES_NAVIGATION } from './tv-series.navigation';

@Injectable({ providedIn: 'root' })
export class TvSeriesNavigationService {
  private readonly router = inject(Router);

  updateCatalogQuery(queryParams: Params, replaceUrl = true): Promise<boolean> {
    return this.router.navigate([], { queryParams, queryParamsHandling: 'merge', replaceUrl });
  }

  goToTvSeries(extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([...TV_SERIES_NAVIGATION.root()], extras);
  }
}
