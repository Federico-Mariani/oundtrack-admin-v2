import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  type ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import type { MovieTrackModel } from '../../../domain/models/movie-track.model';
@Component({
  selector: 'app-movie-track-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective],
  template: `
    <div *transloco="let t; prefix: 'movies.detail'" class="rounded-xl border bg-background/50 p-4">
      <div class="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div class="min-w-0">
          <h4 class="break-words font-medium">{{ track().name }}</h4>
          <p class="text-sm text-muted-foreground">{{ track().artist }}</p>
        </div>
        <span class="rounded-md bg-muted px-2 py-1 text-xs">{{ track().language }}</span>
      </div>
      @if (track().path && !failed()) {
        <audio
          #audio
          controls
          preload="none"
          class="h-10 w-full"
          [src]="track().path"
          [attr.aria-label]="track().name + ' — ' + track().artist"
          (play)="playbackStarted.emit(audio)"
          (error)="failedPath.set(track().path)"
        ></audio>
      } @else {
        <p class="text-sm text-muted-foreground" role="status">{{ t('audioUnavailable') }}</p>
        <button
          type="button"
          class="mt-2 text-sm underline underline-offset-4"
          (click)="reload.emit()"
        >
          {{ t('reload') }}
        </button>
      }
      <details class="mt-3 text-xs text-muted-foreground">
        <summary class="cursor-pointer">{{ t('metadata') }}</summary>
        <dl class="mt-2 grid gap-1 break-all">
          <dt>{{ t('trackId') }}</dt>
          <dd>{{ track().id }}</dd>
          <dt>{{ t('externalTrackId') }}</dt>
          <dd>{{ track().externalId }}</dd>
        </dl>
      </details>
    </div>
  `,
})
export class MovieTrackPlayer {
  readonly track = input.required<MovieTrackModel>();
  readonly playbackStarted = output<HTMLAudioElement>();
  readonly reload = output();
  private readonly audio = viewChild<ElementRef<HTMLAudioElement>>('audio');
  protected readonly failedPath = signal<string | null>(null);
  protected readonly failed = computed(
    () => !!this.failedPath() && this.failedPath() === this.track().path,
  );
  constructor() {
    inject(DestroyRef).onDestroy(() => {
      this.audio()?.nativeElement.pause();
    });
  }
}
