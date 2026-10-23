import { MOVIES_QUERY_PARAMS } from '../../routing/movies.paths';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MoviesNavigationService } from '../../routing/movies-navigation.service';
import { CatalogDetailNavigation } from '@app/core/catalog/presentation/catalog-detail-navigation';
import {
  CatalogQueryKey,
  readCatalogQuery,
  writeCatalogQuery,
  readCatalogDetailId,
} from '@app/core/catalog/presentation/catalog-url-query';
import type { Id } from '@shared/types/id';
import { MovieDetailModal } from '../../components/movie-detail-modal/movie-detail-modal';
import type { MoviesFilterForm } from '../../forms/movies-filter.form';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { MoviesFilters } from '../../components/movies-filters/movies-filters';
import type { DataTableRemoteState } from '@shared/ui/data-table/data-table-remote-state';
import type { PageRequest } from '@shared/types/pagination/page-request';
import {
  DEFAULT_MOVIES_LIST_QUERY,
  type MoviesListQuery,
} from '../../../application/queries/movies-list.query';
import { applyMovieFilterValues } from '../../mappers/movie-filter-values.mapper';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilm } from '@ng-icons/lucide';
import { NotificationService } from '@app/core/notifications/notification.service';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { MoviesTable } from '../../components/movies-table/movies-table';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoviesFilters, MoviesTable, TranslocoDirective, NgIcon],
  providers: [provideIcons({ lucideFilm })],
})
export class MoviesPage {
  private readonly route = inject(ActivatedRoute);
  private readonly navigation = inject(MoviesNavigationService);
  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });
  private readonly detailNavigation = new CatalogDetailNavigation();
  private readonly urlQuery = computed<MoviesListQuery>(
    () => readCatalogQuery(this.params(), MOVIES_QUERY_PARAMS.ExternalId),
    {
      equal: (previous, next) => JSON.stringify(previous) === JSON.stringify(next),
    },
  );
  private readonly moviesFacade = inject(MoviesFacade);
  private readonly language = inject(LanguageService);
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);

  protected readonly query = this.urlQuery;
  protected readonly remote = computed<DataTableRemoteState>(() => ({
    page: this.query().page,
    limit: this.query().limit,
    total: this.moviesFacade.data.total(),
    search: this.query().search,
    filtered:
      Boolean(this.query().search.trim()) ||
      Object.values(this.query().filters).some((value) => value !== undefined),
  }));
  protected readonly movies = this.moviesFacade.data.movies;
  protected readonly loading = this.moviesFacade.requests.getAll.isLoading;
  protected readonly loadError = this.moviesFacade.requests.getAll.error;

  constructor() {
    effect(() => {
      this.language.activeLocale();
      const query = this.urlQuery();
      untracked(() => {
        this.moviesFacade.actions.loadMovies(query, true);
      });
    });
    effect(() => {
      const id = readCatalogDetailId(this.params());
      untracked(() => {
        this.detailNavigation.synchronize(id, MovieDetailModal, (closedId) => {
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
    this.moviesFacade.actions.loadMovies(this.query());
  }

  protected changePage(page: PageRequest): void {
    void this.navigation.updateCatalogQuery(
      writeCatalogQuery({ ...this.query(), ...page }, MOVIES_QUERY_PARAMS.ExternalId),
    );
  }
  protected applyFilters(values: MoviesFilterForm): void {
    void this.navigation.updateCatalogQuery(
      writeCatalogQuery(
        applyMovieFilterValues(this.query(), values),
        MOVIES_QUERY_PARAMS.ExternalId,
      ),
    );
  }
  protected resetQuery(): void {
    void this.navigation.updateCatalogQuery(
      writeCatalogQuery(
        { ...DEFAULT_MOVIES_LIST_QUERY, limit: this.query().limit },
        MOVIES_QUERY_PARAMS.ExternalId,
      ),
    );
  }

  protected copyIdentifier(value: string | number): void {
    if (this.clipboard.copy(String(value))) {
      this.notifications.success(this.transloco.translate('movies.catalog.copied'));
    } else {
      this.notifications.error(this.transloco.translate('movies.catalog.copyFailed'));
    }
  }
}
