import { CreateTvSeriesModal } from '../../components/create-tv-series-modal/create-tv-series-modal';
import { CatalogCreationDialog } from '@app/core/catalog/presentation/catalog-creation-dialog';
import { Button } from '@shared/ui/button/button';
import { TV_SERIES_QUERY_PARAMS } from '../../routing/tv-series.paths';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TvSeriesNavigationService } from '../../routing/tv-series-navigation.service';
import { CatalogDetailNavigation } from '@app/core/catalog/presentation/catalog-detail-navigation';
import {
  CatalogQueryKey,
  readCatalogQuery,
  writeCatalogQuery,
  readCatalogDetailId,
} from '@app/core/catalog/presentation/catalog-url-query';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '@app/core/notifications/notification.service';
import type { DataTableRemoteState } from '@shared/ui/data-table/data-table-remote-state';
import type { Id } from '@shared/types/id';
import type { PageRequest } from '@shared/types/pagination/page-request';
import { TvSeriesFacade } from '../../../application/state/facades/tv-series.facade';
import type { TvSeriesFilterForm } from '../../forms/tv-series-filter.form';
import {
  DEFAULT_TV_SERIES_LIST_QUERY,
  type TvSeriesListQuery,
} from '../../../application/queries/tv-series-list.query';
import { applyTvSeriesFilterValues } from '../../mappers/tv-series-filter-values.mapper';
import { TvSeriesFilters } from '../../components/tv-series-filters/tv-series-filters';
import { TvSeriesTable } from '../../components/tv-series-table/tv-series-table';
import { TvSeriesDetailModal } from '../../components/tv-series-detail-modal/tv-series-detail-modal';

@Component({
  selector: 'app-tv-series-page',
  templateUrl: './tv-series-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, NgIcon, TranslocoDirective, TvSeriesFilters, TvSeriesTable],
  providers: [provideIcons({ lucidePlus })],
})
export class TvSeriesPage {
  private readonly creationDialog = new CatalogCreationDialog();
  protected openCreate(): void {
    this.creationDialog.open(CreateTvSeriesModal, () => {
      this.reload();
    });
  }
  private readonly route = inject(ActivatedRoute);
  private readonly navigation = inject(TvSeriesNavigationService);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly detailNavigation = new CatalogDetailNavigation();
  private readonly urlQuery = computed<TvSeriesListQuery>(
    () => readCatalogQuery(this.params(), TV_SERIES_QUERY_PARAMS.ExternalId),
    { equal: (previous, next) => JSON.stringify(previous) === JSON.stringify(next) },
  );
  private readonly tvSeriesFacade = inject(TvSeriesFacade);
  private readonly language = inject(LanguageService);
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);

  protected readonly query = this.urlQuery;
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
      const query = this.urlQuery();
      untracked(() => {
        this.tvSeriesFacade.actions.getAllTvSeries(query, true);
      });
    });
    effect(() => {
      const id = readCatalogDetailId(this.params());
      untracked(() => {
        this.detailNavigation.synchronize(id, TvSeriesDetailModal, (closedId) => {
          if (readCatalogDetailId(this.route.snapshot.queryParamMap) === closedId) {
            void this.navigation.updateCatalogQuery({ [CatalogQueryKey.Detail]: null });
          }
        });
      });
    });
  }

  protected openDetail(id: Id): void {
    void this.navigation.updateCatalogQuery({ [CatalogQueryKey.Detail]: id }, false);
  }

  protected reload(): void {
    this.tvSeriesFacade.actions.getAllTvSeries(this.query());
  }

  protected changePage(page: PageRequest): void {
    void this.navigation.updateCatalogQuery(
      writeCatalogQuery({ ...this.query(), ...page }, TV_SERIES_QUERY_PARAMS.ExternalId),
    );
  }
  protected applyFilters(values: TvSeriesFilterForm): void {
    void this.navigation.updateCatalogQuery(
      writeCatalogQuery(
        applyTvSeriesFilterValues(this.query(), values),
        TV_SERIES_QUERY_PARAMS.ExternalId,
      ),
    );
  }
  protected resetQuery(): void {
    void this.navigation.updateCatalogQuery(
      writeCatalogQuery(
        { ...DEFAULT_TV_SERIES_LIST_QUERY, limit: this.query().limit },
        TV_SERIES_QUERY_PARAMS.ExternalId,
      ),
    );
  }

  protected copyIdentifier(value: string | number): void {
    if (this.clipboard.copy(String(value))) {
      this.notifications.success(this.transloco.translate('tvSeries.catalog.copied'));
    } else {
      this.notifications.error(this.transloco.translate('tvSeries.catalog.copyFailed'));
    }
  }
}
