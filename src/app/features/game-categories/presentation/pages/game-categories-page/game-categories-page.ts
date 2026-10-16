import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilm, lucideTags } from '@ng-icons/lucide';
import { GameCategoriesFacade } from '../../../application/state/facades/game-categories.facade';
import { GameCategoriesTable } from '../../components/game-categories-table/game-categories-table';

@Component({
  selector: 'app-game-categories-page',
  templateUrl: './game-categories-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, GameCategoriesTable],
  providers: [provideIcons({ lucideFilm, lucideTags })],
})
export class GameCategoriesPage {
  private readonly gameCategoriesFacade = inject(GameCategoriesFacade);

  protected readonly categories = this.gameCategoriesFacade.data.categories;
  protected readonly loading = this.gameCategoriesFacade.requests.getAll.isLoading;
  protected readonly loadError = this.gameCategoriesFacade.requests.getAll.error;

  constructor() {
    this.reload();
  }

  protected reload(): void {
    this.gameCategoriesFacade.actions.getAll();
  }
}
