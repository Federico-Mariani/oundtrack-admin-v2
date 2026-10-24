import { CategoryEditor } from '../../components/category-editor/category-editor';
import { ModalService } from '@shared/ui/modal/modal.service';
import { Button } from '@shared/ui/button/button';
import type { GameCategoryModel } from '../../../domain/models/game-category.model';
import { ChangeDetectionStrategy, Component, inject, ViewContainerRef } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilm, lucideTags, lucidePlus } from '@ng-icons/lucide';
import { GameCategoriesFacade } from '../../../application/state/facades/game-categories.facade';
import { GameCategoriesTable } from '../../components/game-categories-table/game-categories-table';

@Component({
  selector: 'app-game-categories-page',
  templateUrl: './game-categories-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, GameCategoriesTable, Button],
  providers: [provideIcons({ lucideFilm, lucideTags, lucidePlus })],
})
export class GameCategoriesPage {
  private readonly gameCategoriesFacade = inject(GameCategoriesFacade);

  protected readonly categories = this.gameCategoriesFacade.data.categories;
  protected readonly loading = this.gameCategoriesFacade.requests.getAll.isLoading;
  protected readonly loadError = this.gameCategoriesFacade.requests.getAll.error;

  private readonly modals = inject(ModalService);
  private readonly container = inject(ViewContainerRef);
  private editorOpen = false;
  protected manage(category?: GameCategoryModel): void {
    if (this.editorOpen) return;
    this.editorOpen = true;
    this.modals
      .open(
        CategoryEditor,
        { category },
        {
          viewContainerRef: this.container,
          disableClose: true,
          contentClass: 'w-[min(36rem,calc(100vw-2rem))] max-w-none p-6 sm:p-8',
        },
      )
      .closed$.subscribe((changed) => {
        this.editorOpen = false;
        if (changed) this.reload();
      });
  }
  protected manageById(id: string): void {
    const category = this.categories().find((item) => item.id === id);
    if (category) this.manage(category);
  }
  constructor() {
    this.reload();
  }

  protected reload(): void {
    this.gameCategoriesFacade.actions.getAll();
  }
}
