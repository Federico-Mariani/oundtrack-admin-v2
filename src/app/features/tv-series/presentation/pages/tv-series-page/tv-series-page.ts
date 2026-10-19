import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
  ViewContainerRef,
} from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { ModalService } from '@shared/ui/modal/modal.service';
import type { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { LanguageService } from '../../../../../core/i18n/language/language.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '../../../../../core/notifications/notification.service';
import type { DataTableRemoteState } from '@shared/ui/data-table/data-table-remote-state';
import type { Id } from '@shared/types/id';
import type { PageRequest } from '@shared/types/pagination/page-request';
import { TvSeriesFacade } from '../../../application/state/facades/tv-series.facade';
import type { TvSeriesFilterFormModel } from '../../models/tv-series-filter-form.model';
import { DEFAULT_TV_SERIES_LIST_QUERY } from '../../../domain/models/tv-series-list-query.model';
import { applyTvSeriesFilterValues } from '../../mappers/tv-series-filter-values.mapper';
import { TvSeriesFilters } from '../../components/tv-series-filters/tv-series-filters';
import { TvSeriesTable } from '../../components/tv-series-table/tv-series-table';
import { TvSeriesDetailModal } from '../../components/tv-series-detail-modal/tv-series-detail-modal';

@Component({
  selector: 'app-tv-series-page',
  templateUrl: './tv-series-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, TranslocoDirective, TvSeriesFilters, TvSeriesTable],
})
export class TvSeriesPage {
  private readonly modal = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private detailRef?: BrnDialogRef<void>;
  private readonly tvSeriesFacade = inject(TvSeriesFacade);
  private readonly language = inject(LanguageService);
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);

  protected readonly query = this.tvSeriesFacade.data.query;
  protected readonly remote = computed<DataTableRemoteState>(() => ({
    page: this.query().page,
    limit: this.query().limit,
    total: this.tvSeriesFacade.data.total(),
    search: this.query().search,
    filtered:
      Boolean(this.query().search.trim()) ||
      Object.values(this.query().filters).some((value) => value !== undefined),
  }));
  protected readonly tvSeries = this.tvSeriesFacade.data.tvSeries;
  protected readonly loading = this.tvSeriesFacade.requests.getAll.isLoading;
  protected readonly loadError = this.tvSeriesFacade.requests.getAll.error;

  constructor() {
    effect(() => {
      this.language.activeLocale();

      untracked(() => {
        this.reload();
      });
    });
  }

  protected openDetail(id: Id): void {
    if (this.detailRef) {
      return;
    }
    this.detailRef = this.modal.open(
      TvSeriesDetailModal,
      { id },
      {
        viewContainerRef: this.viewContainerRef,
        contentClass:
          'w-[64rem] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] p-0 overflow-hidden',
      },
    );
    this.detailRef.closed$.subscribe(() => {
      this.detailRef = undefined;
    });
  }

  protected reload(): void {
    this.tvSeriesFacade.actions.getAllTvSeries(this.query());
  }

  protected changePage(page: PageRequest): void {
    this.tvSeriesFacade.actions.getAllTvSeries({ ...this.query(), ...page });
  }
  protected applyFilters(values: TvSeriesFilterFormModel): void {
    this.tvSeriesFacade.actions.getAllTvSeries(
      applyTvSeriesFilterValues(this.query(), values),
      true,
    );
  }
  protected resetQuery(): void {
    this.tvSeriesFacade.actions.getAllTvSeries({
      ...DEFAULT_TV_SERIES_LIST_QUERY,
      limit: this.query().limit,
    });
  }

  protected copyIdentifier(value: string | number): void {
    if (this.clipboard.copy(String(value))) {
      this.notifications.success(this.transloco.translate('tvSeries.catalog.copied'));
    } else {
      this.notifications.error(this.transloco.translate('tvSeries.catalog.copyFailed'));
    }
  }
}
