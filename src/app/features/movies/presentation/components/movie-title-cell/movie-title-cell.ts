import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MediaThumbnail } from '@shared/ui/media-thumbnail/media-thumbnail';

@Component({
  selector: 'app-movie-title-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaThumbnail],
  templateUrl: './movie-title-cell.html',
})
export class MovieTitleCell {
  readonly title = input.required<string>();
  readonly releaseDate = input.required<string>();
  readonly releaseDateDescription = input.required<string>();
  readonly posterUrl = input<string | null>(null);
}
