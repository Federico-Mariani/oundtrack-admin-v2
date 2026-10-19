import type { DataTableRemoteState } from '@shared/ui/data-table/data-table-remote-state';
import type { PageRequest } from '@shared/types/pagination/page-request';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  type TemplateRef,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { DataTable } from '@shared/ui/data-table/data-table';
import type { Id } from '@shared/types/id';
import type { TvSeriesTableLabels } from './tv-series-table-labels';
import type { TvSeriesModel } from '../../../domain/models/tv-series.model';
import { createTvSeriesTableColumns } from './tv-series-table.columns';
import { toTvSeriesTableRow } from '../../mappers/tv-series-table-row.mapper';

@Component({
  selector: 'app-tv-series-table',
  host: { class: 'block min-w-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataTable],
  templateUrl: './tv-series-table.html',
})
export class TvSeriesTable {
  private readonly languageService = inject(LanguageService);
  private readonly transloco = inject(TranslocoService);

  readonly tvSeries = input.required<ReadonlyArray<TvSeriesModel>>();
  readonly caption = input.required<string>();
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly remote = input.required<DataTableRemoteState>();
  readonly controls = input<TemplateRef<unknown> | null>(null);
  readonly pageChange = output<PageRequest>();
  readonly resetQuery = output();
  readonly retry = output();
  readonly viewDetail = output<Id>();
  readonly copyId = output<Id>();
  readonly copyExternalId = output<number>();

  private readonly labels = toSignal(
    this.transloco.selectTranslateObject<TvSeriesTableLabels>('table', {}, 'tvSeries'),
  );
  protected readonly columns = computed(() => {
    const labels = this.labels();
    return labels
      ? createTvSeriesTableColumns(
          labels,
          (id) => {
            this.copyId.emit(id);
          },
          (id) => {
            this.copyExternalId.emit(id);
          },
          (id) => {
            this.viewDetail.emit(id);
          },
        )
      : [];
  });
  protected readonly rows = computed(() => {
    const locale = this.languageService.activeLocale();
    const dateFormatter = new Intl.DateTimeFormat(locale, { timeZone: 'UTC' });
    return this.tvSeries().map((tvSeries) => toTvSeriesTableRow(tvSeries, locale, dateFormatter));
  });
  protected readonly initialColumnVisibility = { releaseDate: false };
  protected readonly rowId = (row: { readonly id: Id }): string => row.id;
}
