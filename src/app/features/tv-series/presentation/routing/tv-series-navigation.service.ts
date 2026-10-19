import { inject, Injectable } from '@angular/core';
import { type NavigationExtras, Router } from '@angular/router';
import { TV_SERIES_NAVIGATION } from './tv-series.navigation';

@Injectable({ providedIn: 'root' })
export class TvSeriesNavigationService {
  private readonly router = inject(Router);

  goToTvSeries(extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([...TV_SERIES_NAVIGATION.root()], extras);
  }

  goToCreateTvSeries(extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([...TV_SERIES_NAVIGATION.create()], extras);
  }
}
