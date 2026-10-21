import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MediaThumbnail } from '@shared/ui/media-thumbnail/media-thumbnail';

@Component({
  selector: 'app-media-title-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaThumbnail],
  templateUrl: './media-title-cell.html',
})
export class MediaTitleCell {
  readonly title = input.required<string>();
  readonly releaseDate = input.required<string>();
  readonly releaseDateDescription = input.required<string>();
  readonly posterUrl = input<string | null>(null);
}
