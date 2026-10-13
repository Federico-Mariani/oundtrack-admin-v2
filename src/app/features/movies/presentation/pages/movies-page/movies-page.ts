import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFilm, lucideRefreshCw } from '@ng-icons/lucide';
import { Button } from '@shared/ui/button/button';
import { NotificationService } from '@app/core/notifications/notification.service';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { MoviesTable } from '../../components/movies-table/movies-table';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoviesTable, TranslocoDirective, Button, NgIcon],
  providers: [provideIcons({ lucideFilm, lucideRefreshCw })],
})
export class MoviesPage {
  private readonly moviesFacade = inject(MoviesFacade);
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);

  protected readonly movies = this.moviesFacade.data.movies;
  protected readonly loading = this.moviesFacade.loadingStatuses.isLoadingMovies;
  protected readonly loadError = this.moviesFacade.errorStatuses.loadMovies;

  constructor() {
    this.moviesFacade.actions.loadMovies();
  }

  protected reload(): void {
    this.moviesFacade.actions.loadMovies();
  }

  protected copyIdentifier(value: string | number): void {
    if (this.clipboard.copy(String(value))) {
      this.notifications.success(this.transloco.translate('movies.catalog.copied'));
    } else {
      this.notifications.error(this.transloco.translate('movies.catalog.copyFailed'));
    }
  }
}
