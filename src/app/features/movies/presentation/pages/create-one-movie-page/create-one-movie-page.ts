import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';

@Component({
  selector: 'app-create-one-movie-page',
  templateUrl: './create-one-movie-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOneMoviePage {
  private readonly moviesFacade: MoviesFacade = inject(MoviesFacade);
}
