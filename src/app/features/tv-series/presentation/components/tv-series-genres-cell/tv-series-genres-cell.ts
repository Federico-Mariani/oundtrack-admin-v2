import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-tv-series-genres-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tv-series-genres-cell.html',
})
export class TvSeriesGenresCell {
  readonly genres = input.required<ReadonlyArray<string>>();
}
