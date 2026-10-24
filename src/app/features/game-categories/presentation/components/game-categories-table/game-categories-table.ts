import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { DataTable } from '@shared/ui/data-table/data-table';
import type { DataTableRemoteState } from '@shared/ui/data-table/data-table-remote-state';
import type { GameCategoryModel } from '../../../domain/models/game-category.model';
import type { GameCategoryTableRowModel } from '../../models/game-category-table-row.model';
import { toGameCategoryTableRow } from '../../mappers/game-category-table-row.mapper';
import { createGameCategoriesTableColumns } from './game-categories-table.columns';
import type { GameCategoriesTableLabels } from './game-categories-table-labels';

@Component({
  selector: 'app-game-categories-table',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataTable],
  templateUrl: './game-categories-table.html',
})
export class GameCategoriesTable {
  private readonly languageService = inject(LanguageService);
  private readonly transloco = inject(TranslocoService);

  readonly categories = input.required<ReadonlyArray<GameCategoryModel>>();
  readonly caption = input.required<string>();
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly retry = output();
  readonly manage = output<string>();

  private readonly labels = toSignal(
    this.transloco.selectTranslateObject<GameCategoriesTableLabels>('table', {}, 'gameCategories'),
  );

  protected readonly columns = computed(() => {
    const labels = this.labels();

    return labels
      ? createGameCategoriesTableColumns(labels, (id) => {
          this.manage.emit(id);
        })
      : [];
  });

  protected readonly rows = computed(() => {
    const locale = this.languageService.activeLocale();

    return this.categories().map((category) => toGameCategoryTableRow(category, locale));
  });

  protected readonly remote = computed<DataTableRemoteState>(() => {
    const total = this.rows().length;

    return {
      page: 1,
      limit: Math.max(1, total),
      total,
      search: '',
      filtered: false,
    };
  });

  protected readonly rowId = (row: GameCategoryTableRowModel): string => row.id;
}
