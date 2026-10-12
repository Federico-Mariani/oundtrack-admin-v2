import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';

@Component({
  selector: 'app-media-thumbnail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './media-thumbnail.html',
})
export class MediaThumbnail {
  readonly src = input<string | null | undefined>();
  readonly alt = input('');
  readonly width = input(48);
  readonly height = input(72);
  protected readonly hasError = signal(false);

  constructor() {
    effect(() => {
      this.src();
      this.hasError.set(false);
    });
  }
}
