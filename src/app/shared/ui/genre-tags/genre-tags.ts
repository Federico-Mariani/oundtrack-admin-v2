import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-genre-tags',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './genre-tags.html',
})
export class GenreTags {
  readonly genres = input.required<ReadonlyArray<string>>();
}
