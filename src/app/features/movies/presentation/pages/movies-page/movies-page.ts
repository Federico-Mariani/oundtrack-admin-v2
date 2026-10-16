import type { Id } from '@shared/types/id';
import type { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { ModalService } from '@shared/ui/modal/modal.service';
import { MovieDetailModal } from '../../components/movie-detail-modal/movie-detail-modal';
import type { MoviesFilterFormModel } from '../../models/movies-filter-form.model';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { MoviesFilters } from '../../components/movies-filters/movies-filters';
import type { DataTableRemoteState } from '@shared/ui/data-table/data-table-remote-state';
import type { PageRequest } from '@shared/types/pagination/page-request';
import { DEFAULT_MOVIES_LIST_QUERY } from '../../../domain/models/movies-list-query.model';
import { applyMovieFilterValues } from '../../mappers/movie-filter-values.mapper';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  untracked,
  ViewContainerRef,
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
  private readonly modal = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private detailRef?: BrnDialogRef<void>;
  private readonly moviesFacade = inject(MoviesFacade);
  private readonly language = inject(LanguageService);
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);

  protected readonly query = this.moviesFacade.data.query;
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
      MovieDetailModal,
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
    this.moviesFacade.actions.loadMovies(this.query());
  }

  protected changePage(page: PageRequest): void {
    this.moviesFacade.actions.loadMovies({ ...this.query(), ...page });
  }
  protected applyFilters(values: MoviesFilterFormModel): void {
    this.moviesFacade.actions.loadMovies(applyMovieFilterValues(this.query(), values), true);
  }
  protected resetQuery(): void {
    this.moviesFacade.actions.loadMovies({
      ...DEFAULT_MOVIES_LIST_QUERY,
      limit: this.query().limit,
    });
  }

  protected copyIdentifier(value: string | number): void {
    if (this.clipboard.copy(String(value))) {
      this.notifications.success(this.transloco.translate('movies.catalog.copied'));
    } else {
      this.notifications.error(this.transloco.translate('movies.catalog.copyFailed'));
    }
  }
}
