import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage {
  private readonly moviesFacade: MoviesFacade = inject(MoviesFacade);

  constructor() {
    this.moviesFacade.actions.loadMovies();
  }
}
