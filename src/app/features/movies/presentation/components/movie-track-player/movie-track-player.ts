import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  type ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCloudUpload,
  lucideInfo,
  lucideLanguages,
  lucideListPlus,
  lucideLoaderCircle,
  lucideMusic2,
  lucidePause,
  lucidePlay,
  lucideReplace,
  lucideVolume2,
  lucideVolumeX,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import type { MovieSoundtrackTrackModel } from '../../../domain/models/movie-soundtrack-track.model';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { HlmSlider } from '@spartan-ng/helm/slider';

@Component({
  selector: 'app-movie-track-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, HlmButton, IconButton, HlmSlider],
  providers: [
    provideIcons({
      lucidePlay,
      lucidePause,
      lucideInfo,
      lucideVolume2,
      lucideVolumeX,
      lucideLoaderCircle,
      lucideMusic2,
      lucideLanguages,
      lucideReplace,
      lucideCloudUpload,
      lucideListPlus,
    }),
  ],
  templateUrl: './movie-track-player.html',
})
export class MovieTrackPlayer {
  readonly track = input.required<MovieSoundtrackTrackModel>();
  readonly soundtrackId = input.required<string>();
  readonly playbackStarted = output<HTMLAudioElement>();
  readonly reload = output();
  readonly editLanguages = output();
  readonly uploadAudio = output();
  readonly manageAudio = output();
  private readonly destroyRef = inject(DestroyRef);
  private readonly audio = viewChild<ElementRef<HTMLAudioElement>>('audio');
  protected readonly failed = signal(false);
  protected readonly playing = signal(false);
  protected readonly buffering = signal(false);
  protected readonly playPending = signal(false);
  protected readonly currentTime = signal([0]);
  protected readonly duration = signal(0);
  protected readonly muted = signal(false);
  protected readonly showInfo = signal(false);
  constructor() {
    effect(() => {
      const path = this.track().path;
      this.failed.set(!path);
      this.playing.set(false);
      this.buffering.set(false);
      this.currentTime.set([0]);
      this.duration.set(0);
    });
    this.destroyRef.onDestroy(() => {
      this.audio()?.nativeElement.pause();
    });
  }
  protected async togglePlayback(): Promise<void> {
    const audio = this.audio()?.nativeElement;
    if (!audio || this.playPending()) {
      return;
    }
    if (!audio.paused) {
      audio.pause();
      return;
    }
    this.playPending.set(true);
    try {
      await audio.play();
      if (this.destroyRef.destroyed) {
        audio.pause();
      }
    } catch (error: unknown) {
      if (
        !this.destroyRef.destroyed &&
        !(error instanceof DOMException && error.name === 'AbortError')
      ) {
        this.mediaError();
      }
    } finally {
      if (!this.destroyRef.destroyed) {
        this.playPending.set(false);
      }
    }
  }
  protected started(audio: HTMLAudioElement): void {
    this.playing.set(true);
    this.playbackStarted.emit(audio);
  }
  protected paused(): void {
    this.playing.set(false);
    this.buffering.set(false);
  }
  protected updateTime(audio: HTMLAudioElement): void {
    this.currentTime.set([Number.isFinite(audio.currentTime) ? audio.currentTime : 0]);
    this.duration.set(Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0);
  }
  protected seek(event: Event): void {
    const audio = this.audio()?.nativeElement;
    if (audio && this.duration() > 0 && event.target instanceof HTMLInputElement) {
      audio.currentTime = Math.max(0, Math.min(this.duration(), event.target.valueAsNumber));
      this.updateTime(audio);
    }
  }
  protected toggleMute(): void {
    const audio = this.audio()?.nativeElement;
    if (!audio) {
      return;
    }
    if (audio.volume === 0) {
      audio.volume = 1;
      audio.muted = false;
    } else {
      audio.muted = !audio.muted;
    }
    this.updateVolume(audio);
  }
  protected updateVolume(audio: HTMLAudioElement): void {
    this.muted.set(audio.muted || audio.volume === 0);
  }
  protected mediaError(): void {
    this.audio()?.nativeElement.pause();
    this.failed.set(true);
    this.playing.set(false);
    this.buffering.set(false);
  }
  protected formatTime(seconds: number): string {
    const total = Math.max(0, Math.floor(seconds));
    return `${String(Math.floor(total / 60))}:${String(total % 60).padStart(2, '0')}`;
  }
}
