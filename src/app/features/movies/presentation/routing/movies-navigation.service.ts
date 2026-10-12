import { inject, Injectable } from '@angular/core';
import { type NavigationExtras, Router } from '@angular/router';
import { MOVIES_NAVIGATION } from './movies.navigation';

@Injectable({ providedIn: 'root' })
export class MoviesNavigationService {
  private readonly router = inject(Router);

  goToMovies(extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([...MOVIES_NAVIGATION.root()], extras);
  }

  goToCreateMovie(extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([...MOVIES_NAVIGATION.create()], extras);
  }
}
