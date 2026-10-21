import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

@Component({
  selector: 'app-media-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block overflow-hidden bg-muted' },
  template: `
    @if (visible()) {
      <img
        [src]="src()"
        [alt]="alt()"
        class="h-full w-full object-cover"
        (error)="failedUrl.set(src())"
      />
    } @else if (alt()) {
      <span
        class="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground"
        >{{ fallback() }}</span
      >
    }
  `,
})
export class MediaImage {
  readonly src = input<string | null | undefined>();
  readonly alt = input('');
  readonly fallback = input('');
  protected readonly failedUrl = signal<string | null | undefined>(undefined);
  protected readonly visible = computed(() => !!this.src() && this.src() !== this.failedUrl());
}
