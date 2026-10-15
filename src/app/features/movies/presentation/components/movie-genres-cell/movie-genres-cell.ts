import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-movie-genres-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './movie-genres-cell.html',
})
export class MovieGenresCell {
  readonly genres = input.required<ReadonlyArray<string>>();
}
