import { inject, Injectable } from '@angular/core';
import { type NavigationExtras, Router } from '@angular/router';
import { GAME_CATEGORIES_NAVIGATION } from './game-categories.navigation';

@Injectable({ providedIn: 'root' })
export class GameCategoriesNavigationService {
  private readonly router = inject(Router);

  goToGameCategories(extras?: NavigationExtras): Promise<boolean> {
    return this.router.navigate([...GAME_CATEGORIES_NAVIGATION.root()], extras);
  }
}
