import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MediaImage } from '@shared/ui/media-image/media-image';
@Component({
  selector: 'app-avatar-image-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MediaImage],
  template: `<app-media-image
    class="block size-16 rounded-md bg-muted/40"
    [contain]="true"
    [src]="path()"
    [alt]="label()"
    [fallback]="label()"
  />`,
})
export class AvatarImageCell {
  readonly path = input.required<string>();
  readonly label = input.required<string>();
}
