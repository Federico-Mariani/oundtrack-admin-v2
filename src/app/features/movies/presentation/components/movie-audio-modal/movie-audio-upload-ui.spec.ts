import type { MoviesStoreActionsFacade } from '../../../application/state/facades/movies-store-actions.facade';
import { DIALOG_DATA } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';
import { of } from 'rxjs';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import type { RequestError } from '@shared/state/request/request-error';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import {
  initialMoviesAudioState,
  type MoviesAudioState,
} from '../../../application/state/movies-audio.state';
import { MovieAudioMode } from '../../../domain/models/movie-audio-mode.model';
import { moviesTranslationsLoader } from '../../i18n/movies-translations.loader';
import { MovieAudioModal } from './movie-audio-modal';

@Component({
  selector: 'app-modal-frame',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
})
class TestFrame {
  readonly title = input('');
  readonly description = input('');
  readonly closeDisabled = input(false);
  readonly closeResult = input<unknown>(undefined);
}
class TranslationLoader {
  getTranslation() {
    return of({});
  }
}

async function setup() {
  const busy = signal(false);
  const success = signal(false);
  const error = signal<RequestError | null>(null);
  const audio = signal<MoviesAudioState>({ ...initialMoviesAudioState });
  const save = vi.fn<MoviesStoreActionsFacade['saveAudio']>();
  const close = vi.fn();
  const notify = { success: vi.fn(), error: vi.fn() };
  TestBed.configureTestingModule({
    imports: [MovieAudioModal],
    providers: [
      provideTransloco({
        config: { availableLangs: ['en', 'it'], defaultLang: 'en', prodMode: true },
        loader: TranslationLoader,
      }),
      provideTranslocoScope({ scope: 'movies', loader: moviesTranslationsLoader }),
      { provide: BrnDialogRef, useValue: { close } },
      {
        provide: DIALOG_DATA,
        useValue: {
          params: {
            mode: MovieAudioMode.Version,
            movieId: 'movie',
            locale: 'en-US',
            soundtrack: { id: 'soundtrack', tracks: [{ id: 'existing', languages: ['it-IT'] }] },
          },
        },
      },
      { provide: NotificationService, useValue: notify },
      {
        provide: MoviesFacade,
        useValue: {
          data: { audio },
          requests: { audio: { isLoading: busy, isSuccess: success, error } },
          actions: { openAudio: vi.fn(), closeAudio: vi.fn(), saveAudio: save },
        },
      },
    ],
  });
  TestBed.overrideComponent(MovieAudioModal, {
    remove: { imports: [ModalFrame] },
    add: { imports: [TestFrame] },
  });
  const fixture = TestBed.createComponent(MovieAudioModal);
  await fixture.whenStable();
  const element = fixture.nativeElement as HTMLElement;
  await vi.waitFor(() => {
    expect(element.querySelector('form')).not.toBeNull();
  });
  const submit = async () => {
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
  };
  const choose = async (file: File) => {
    const input = element.querySelector<HTMLInputElement>('input[type=file]')!;
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: { length: 1, item: () => file },
    });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
  };
  return { fixture, element, submit, choose, busy, success, error, save, close, notify, audio };
}
describe('Movie audio editor', () => {
  it('validates the file before creating anything and prevents duplicate submissions while pending', async () => {
    const { element, fixture, choose, submit, save, busy } = await setup();
    const input = element.querySelector<HTMLInputElement>('input[type=text]')!;
    input.value = '  spotify-id  ';
    input.dispatchEvent(new Event('input'));
    await choose(new File(['plain text'], 'renamed.mp3'));
    await submit();
    expect(save).not.toHaveBeenCalled();
    expect(element.textContent).toContain('valid, non-empty');
    await choose(new File(['ID3audio'], 'recording.mp3'));
    await submit();
    expect(save).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        externalId: 'spotify-id',
        languages: ['en-US'],
      }),
    );
    expect(save.mock.calls[0][1].fileKey).toEqual(expect.any(String));
    expect(element.querySelector('app-file-dropzone')).toBeNull();
    const remove = element.querySelector<HTMLButtonElement>('app-file-attachment button')!;
    remove.click();
    await fixture.whenStable();
    expect(element.querySelector('app-file-attachment')).toBeNull();
    expect(element.querySelector('app-file-dropzone')).not.toBeNull();
    await submit();
    expect(save).toHaveBeenCalledTimes(1);
    await choose(new File(['ID3audio'], 'recording.mp3'));
    busy.set(true);
    await fixture.whenStable();
    await submit();
    expect(save).toHaveBeenCalledTimes(1);
    expect(element.querySelector('app-file-dropzone')).toBeNull();
    expect(element.querySelector<HTMLButtonElement>('app-file-attachment button')?.disabled).toBe(
      true,
    );
    expect(element.querySelector('app-file-attachment')?.textContent).toContain('recording.mp3');
  });
  it('closes without changes for a local selection, but reports a partially created track', async () => {
    const { element, fixture, choose, close, audio } = await setup();
    await choose(new File(['ID3audio'], 'recording.mp3'));
    const closeButton = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent.trim() === 'Close',
    )!;
    closeButton.click();
    expect(close).toHaveBeenLastCalledWith(false);
    audio.set({
      ...initialMoviesAudioState,
      track: {
        id: 'created',
        externalId: 'spotify',
        path: null,
        name: 'Track',
        artist: 'Artist',
        languages: ['en-US'],
      },
    });
    await fixture.whenStable();
    closeButton.click();
    expect(close).toHaveBeenLastCalledWith(true);
  });
  it('uses a text action for select-all without an indeterminate master checkbox', async () => {
    const { element, fixture } = await setup();
    expect(element.querySelectorAll('app-checkbox-choice')).toHaveLength(2);
    const action = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find(
      (button) => button.textContent.trim() === 'Clear selection',
    )!;
    action.click();
    await fixture.whenStable();
    expect(action.textContent).toContain('Select all available languages');
    action.click();
    await fixture.whenStable();
    expect(action.textContent).toContain('Clear selection');
  });
  it('shows field errors and notifications, and closes only on completed success', async () => {
    const { error, success, fixture, element, close, notify } = await setup();
    error.set({
      code: 'validation',
      fieldErrors: { externalId: ['Unknown provider track'], languages: ['Language unavailable'] },
    });
    await fixture.whenStable();
    expect(element.textContent).toContain('Unknown provider track');
    expect(element.textContent).toContain('Language unavailable');
    expect(notify.error).toHaveBeenCalledTimes(1);
    expect(close).not.toHaveBeenCalled();
    error.set(null);
    success.set(true);
    await fixture.whenStable();
    expect(notify.success).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledWith(true);
  });
});
