import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MediaThumbnail } from '@shared/ui/media-thumbnail/media-thumbnail';

@Component({
  selector: 'app-game-category-name-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaThumbnail],
  templateUrl: './game-category-name-cell.html',
})
export class GameCategoryNameCell {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null>(null);
}
