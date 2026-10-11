import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import { MoviesTable } from '../../components/movies-table/movies-table';
import Heading3 from '@shared/ui/typography/heading-3/heading-3';

@Component({
  selector: 'app-movies-page',
  templateUrl: './movies-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MoviesTable, Heading3],
})
export class MoviesPage {
  private readonly moviesFacade: MoviesFacade = inject(MoviesFacade);

  constructor() {
    this.moviesFacade.actions.loadMovies();
  }

  protected readonly movies = this.moviesFacade.data.movies;
}
