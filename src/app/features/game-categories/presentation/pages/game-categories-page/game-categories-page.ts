import { LanguageService } from '@app/core/i18n/language/language.service';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilm } from '@ng-icons/lucide';
import { GameCategoriesFacade } from '../../../application/state/facades/game-categories.facade';

@Component({
  selector: 'app-game-categories-page',
  templateUrl: './game-categories-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon],
  providers: [provideIcons({ lucideFilm })],
})
export class GameCategoriesPage {
  private readonly gameCategoriesFacade = inject(GameCategoriesFacade);
  private readonly language = inject(LanguageService);
  private readonly transloco = inject(TranslocoService);

  protected readonly categories = this.gameCategoriesFacade.data.categories;
  protected readonly loading = this.gameCategoriesFacade.loadingStatuses.isLoadingGameCategories;
  protected readonly loadError = this.gameCategoriesFacade.errorStatuses.loadCategories;
}
