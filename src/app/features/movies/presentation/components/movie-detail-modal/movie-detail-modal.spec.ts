import { Clipboard } from '@angular/cdk/clipboard';
import { NotificationService } from '@app/core/notifications/notification.service';
import {
  ChangeDetectionStrategy,
  Component,
  ViewContainerRef,
  inject,
  signal,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideTransloco, provideTranslocoScope } from '@jsverse/transloco';
import { of } from 'rxjs';
import validation from '@app/core/i18n/translations/en/validation.json';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { ModalService } from '@shared/ui/modal/modal.service';
import type { RequestError } from '@shared/state/request/request-error';
import { MoviesFacade } from '../../../application/state/facades/movies.facade';
import type { MovieDetailModel } from '../../../domain/models/movie-detail.model';
import { moviesTranslationsLoader } from '../../i18n/movies-translations.loader';
import { MovieDetailModal } from './movie-detail-modal';

@Component({
  selector: 'app-movie-detail-test-owner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideTranslocoScope({ scope: 'movies', loader: moviesTranslationsLoader })],
  template: '',
})
class MovieDetailTestOwner {
  readonly viewContainerRef = inject(ViewContainerRef);
}
class EmptyTranslationLoader {
  getTranslation() {
    return of({ validation });
  }
}
function movie(): MovieDetailModel {
  return {
    id: 'one',
    externalMovieId: 157336,
    createdAt: 0,
    updatedAt: 0,
    genres: [],
    info: {
      'it-IT': {
        id: 'info',
        title: 'Interstellar',
        releaseDate: 1415145600000,
        posterUrl: 'https://example.com/poster.jpg',
        backdropUrl: '',
        createdAt: 0,
        updatedAt: 0,
      },
    },
    gameCategories: [
      { id: 'category', image: null, info: { 'it-IT': { id: 'cat-info', name: 'Film' } } },
    ],
    soundtracks: [
      {
        id: 'soundtrack',
        tracks: [
          {
            id: 'track',
            externalId: 'external',
            name: 'S.T.A.Y.',
            artist: 'Hans Zimmer',
            language: 'it-IT',
            path: 'https://example.com/track.mp3',
          },
        ],
      },
    ],
  };
}
describe('Movie detail modal', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  function setup() {
    const detail = signal<MovieDetailModel | null>(null);
    const loading = signal(true);
    const error = signal<RequestError | null>(null);
    const creatingInfo = signal(false);
    const infoCreated = signal(false);
    const infoError = signal<RequestError | null>(null);
    const actions = {
      loadDetail: vi.fn(),
      closeDetail: vi.fn(),
      createInfo: vi.fn(() => {
        creatingInfo.set(true);
      }),
      resetCreateInfo: vi.fn(() => {
        infoError.set(null);
        infoCreated.set(false);
        creatingInfo.set(false);
      }),
    };
    TestBed.configureTestingModule({
      imports: [MovieDetailTestOwner],
      providers: [
        {
          provide: MoviesFacade,
          useValue: {
            data: { detail, infoCreated },
            loadingStatuses: { isLoadingDetail: loading, isCreatingInfo: creatingInfo },
            errorStatuses: { detail: error, createInfo: infoError },
            actions,
          },
        },
        { provide: LanguageService, useValue: { activeLocale: signal('en-US') } },
        provideTransloco({
          config: {
            availableLangs: ['en', 'it'],
            defaultLang: 'en',
            reRenderOnLangChange: true,
            prodMode: true,
          },
          loader: EmptyTranslationLoader,
        }),
      ],
    });
    const fixture = TestBed.createComponent(MovieDetailTestOwner);
    const ref = TestBed.inject(ModalService).open(
      MovieDetailModal,
      { id: 'one' },
      {
        viewContainerRef: fixture.componentInstance.viewContainerRef,
        contentClass:
          'w-[64rem] max-w-[calc(100vw-2rem)] sm:max-w-[calc(100vw-2rem)] p-0 overflow-hidden',
      },
    );
    return { fixture, ref, detail, loading, error, actions, creatingInfo, infoCreated, infoError };
  }
  it('loads the requested movie, renders localized fallback and media, and clears state on close', async () => {
    const { fixture, ref, detail, loading, actions } = setup();
    await fixture.whenStable();
    expect(actions.loadDetail).toHaveBeenCalledExactlyOnceWith('one');
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Loading movie');
    });
    expect(document.querySelector('app-movie-detail-skeleton')).not.toBeNull();
    expect(document.querySelector('app-select')).toBeNull();
    await vi.waitFor(() => {
      expect(
        document.querySelector<HTMLButtonElement>('button[aria-label="Reload details"]')?.disabled,
      ).toBe(true);
    });
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    expect(document.querySelector('app-movie-detail-skeleton')).toBeNull();
    expect(document.body.textContent).toContain('Interstellar');
    expect(document.body.textContent).toContain('Film');
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('Hans Zimmer');
    });
    const audio = document.querySelector('audio')!;
    expect(audio.preload).toBe('none');
    expect(audio.autoplay).toBe(false);
    audio.dispatchEvent(new Event('play'));
    const image = document.querySelector<HTMLImageElement>('img[alt="Interstellar"]')!;
    image.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Image unavailable');
    ref.forceClose();
    expect(actions.closeDetail).toHaveBeenCalledExactlyOnceWith('one');
    expect(audio.pause).toHaveBeenCalled();
    fixture.destroy();
  });
  it('reloads from the header, pauses playback and prevents repeated requests while pending', async () => {
    const { fixture, ref, detail, loading, actions } = setup();
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('audio')).not.toBeNull();
    });
    const audio = document.querySelector('audio')!;
    audio.dispatchEvent(new Event('play'));
    const reload = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Reload details"]',
    )!;
    reload.click();
    expect(actions.loadDetail).toHaveBeenCalledTimes(2);
    expect(audio.pause).toHaveBeenCalled();
    loading.set(true);
    await fixture.whenStable();
    reload.click();
    expect(actions.loadDetail).toHaveBeenCalledTimes(2);
    expect(document.querySelector('app-select')).toBeNull();
    ref.forceClose();
    fixture.destroy();
  });
  it('shows request failures, supports retry, and renders empty sections', async () => {
    const { fixture, ref, detail, loading, error, actions } = setup();
    loading.set(false);
    error.set({ code: 'not-found', status: 404 });
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('This movie is no longer available.');
    });
    Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
      .find((button) => button.textContent.includes('Try again'))!
      .click();
    expect(actions.loadDetail).toHaveBeenCalledTimes(2);
    error.set(null);
    detail.set({ ...movie(), gameCategories: [], soundtracks: [] });
    await fixture.whenStable();
    expect(document.body.textContent).toContain('No game categories available.');
    expect(document.body.textContent).toContain('No tracks available in this language.');
    ref.forceClose();
    fixture.destroy();
  });
  it('offers a detail reload when a signed audio URL is unavailable', async () => {
    const { fixture, ref, detail, loading, actions } = setup();
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('audio')).not.toBeNull();
    });
    document.querySelector('audio')!.dispatchEvent(new Event('error'));
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Audio unavailable.');
    Array.from(document.querySelectorAll<HTMLButtonElement>('button'))
      .find((button) => button.textContent.includes('Reload details'))!
      .click();
    expect(actions.loadDetail).toHaveBeenCalledTimes(2);
    ref.forceClose();
    fixture.destroy();
  });
  it('provides compact playback, seek, mute and technical information controls', async () => {
    const { fixture, ref, detail, loading } = setup();
    const first = movie();
    const track = first.soundtracks[0].tracks[0];
    detail.set({
      ...first,
      soundtracks: [
        {
          id: 'soundtrack',
          tracks: [track, { ...track, id: 'track-two', name: 'Cornfield Chase' }],
        },
      ],
    });
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelectorAll('audio')).toHaveLength(2);
    });
    const audio = document.querySelectorAll('audio')[0];
    const second = document.querySelectorAll('audio')[1];
    let paused = true;
    vi.spyOn(audio, 'paused', 'get').mockImplementation(() => paused);
    vi.spyOn(audio, 'duration', 'get').mockReturnValue(150);
    vi.spyOn(audio, 'play').mockImplementation(() => {
      paused = false;
      audio.dispatchEvent(new Event('play'));
      audio.dispatchEvent(new Event('playing'));
      return Promise.resolve();
    });
    const pause = vi.spyOn(audio, 'pause').mockImplementation(() => {
      paused = true;
      audio.dispatchEvent(new Event('pause'));
    });
    const button = (label: string): HTMLButtonElement =>
      document.querySelector<HTMLButtonElement>(`button[aria-label="${label}: S.T.A.Y."]`)!;
    expect(audio.controls).toBe(false);
    expect(document.querySelector('app-movie-detail-modal details')).toBeNull();
    button('Play').click();
    await fixture.whenStable();
    expect(audio.play).toHaveBeenCalledOnce();
    expect(button('Pause')).not.toBeNull();
    audio.dispatchEvent(new Event('loadedmetadata'));
    await fixture.whenStable();
    const seek = document.querySelector<HTMLInputElement>(
      'input[aria-label="Playback position: S.T.A.Y."]',
    )!;
    expect(seek.disabled).toBe(false);
    seek.value = '65';
    seek.dispatchEvent(new Event('input'));
    expect(audio.currentTime).toBe(65);
    expect(document.querySelector('input[aria-label="Volume: S.T.A.Y."]')).toBeNull();
    button('Mute').click();
    await fixture.whenStable();
    expect(audio.muted).toBe(true);
    button('Unmute').click();
    await fixture.whenStable();
    expect(audio.muted).toBe(false);
    second.dispatchEvent(new Event('play'));
    await fixture.whenStable();
    expect(pause).toHaveBeenCalled();
    expect(button('Play')).not.toBeNull();
    expect(document.getElementById('track-info-soundtrack-track')).toBeNull();
    button('Track information').click();
    await fixture.whenStable();
    expect(button('Track information').getAttribute('aria-expanded')).toBe('true');
    expect(document.getElementById('track-info-soundtrack-track')?.textContent).toContain(
      'external',
    );
    ref.forceClose();
    fixture.destroy();
  });
  it('handles rejected playback without leaving the custom player pending', async () => {
    const { fixture, ref, detail, loading } = setup();
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('audio')).not.toBeNull();
    });
    const audio = document.querySelector('audio')!;
    vi.spyOn(audio, 'play').mockRejectedValue(
      new DOMException('Cannot decode', 'NotSupportedError'),
    );
    document.querySelector<HTMLButtonElement>('button[aria-label="Play: S.T.A.Y."]')!.click();
    await fixture.whenStable();
    expect(document.body.textContent).toContain('Audio unavailable.');
    expect(document.querySelector('button[aria-label="Play: S.T.A.Y."]')).toBeNull();
    ref.forceClose();
    fixture.destroy();
  });
  it('switches movie content and tracks with the pinned language selector and pauses playback', async () => {
    const { fixture, ref, detail, loading } = setup();
    const value = movie();
    const italian = value.info['it-IT']!;
    const track = value.soundtracks[0].tracks[0];
    detail.set({
      ...value,
      info: { ...value.info, 'en-US': { ...italian, id: 'english-info', title: 'English title' } },
      genres: [
        {
          id: 'genre',
          info: {
            'it-IT': { id: 'gi', name: 'Avventura' },
            'en-US': { id: 'ge', name: 'Adventure' },
          },
        },
      ],
      gameCategories: [
        {
          id: 'category',
          image: null,
          info: { 'it-IT': { id: 'ci', name: 'Film' }, 'en-US': { id: 'ce', name: 'Movies' } },
        },
      ],
      soundtracks: [
        {
          id: 'soundtrack',
          tracks: [
            track,
            { ...track, id: 'english-track', name: 'English track', language: 'en-US' },
          ],
        },
      ],
    });
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('English track');
    });
    const select = document.querySelector<HTMLButtonElement>('app-select button')!;
    expect(select.textContent).toContain('English');
    expect(select.disabled).toBe(false);
    expect(document.body.textContent).toContain('English title');
    expect(document.body.textContent).toContain('Adventure');
    expect(document.querySelectorAll('audio')).toHaveLength(1);
    const audio = document.querySelector('audio')!;
    audio.dispatchEvent(new Event('play'));
    select.click();
    await fixture.whenStable();
    const option = Array.from(document.querySelectorAll<HTMLElement>('hlm-select-item')).find(
      (item) => item.textContent.includes('Italiano'),
    )!;
    option.click();
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.body.textContent).toContain('S.T.A.Y.');
    });
    expect(audio.pause).toHaveBeenCalled();
    expect(document.body.textContent).toContain('Interstellar');
    expect(document.body.textContent).toContain('Avventura');
    expect(document.body.textContent).not.toContain('English title');
    expect(document.body.textContent).not.toContain('English track');
    expect(document.querySelector('[aria-label="Game categories"]')?.textContent).toContain('Film');
    ref.forceClose();
    fixture.destroy();
  });
  it('opens a single-language select and copies classification IDs from context menus', async () => {
    const { fixture, ref, detail, loading } = setup();
    detail.set({
      ...movie(),
      genres: [
        { id: 'genre-context-id', info: { 'it-IT': { id: 'genre-info', name: 'Avventura' } } },
      ],
    });
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('app-select button')).not.toBeNull();
    });
    const select = document.querySelector<HTMLButtonElement>('app-select button')!;
    expect(select.disabled).toBe(false);
    expect(select.textContent).toContain('Italiano');
    select.click();
    await fixture.whenStable();
    expect(document.querySelectorAll('hlm-select-item')).toHaveLength(1);
    document.querySelector<HTMLElement>('hlm-select-item')!.click();
    await fixture.whenStable();
    const values = Array.from(document.querySelectorAll('.metadata-list dd'), (element) =>
      element.textContent.trim(),
    );
    expect(values).not.toContain('info');
    expect(values).not.toContain('it-IT');
    expect(values).not.toContain('category');
    expect(values).not.toContain('genre-context-id');
    const genre = document.querySelector<HTMLElement>('[aria-label="Genres"] [tabindex="0"]')!;
    const copy = vi.spyOn(TestBed.inject(Clipboard), 'copy').mockReturnValue(true);
    const success = vi
      .spyOn(TestBed.inject(NotificationService), 'success')
      .mockImplementation(() => undefined);
    const failure = vi
      .spyOn(TestBed.inject(NotificationService), 'error')
      .mockImplementation(() => undefined);
    genre.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(document.querySelector('[role="menu"]')?.textContent).toContain('genre-context-id');
    document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click();
    await fixture.whenStable();
    expect(copy).toHaveBeenLastCalledWith('genre-context-id');
    expect(success).toHaveBeenCalledWith('Identifier copied.');
    const category = document.querySelector<HTMLElement>(
      '[aria-label="Game categories"] [tabindex="0"]',
    )!;
    copy.mockReturnValue(false);
    category.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    expect(document.querySelector('[role="menu"]')?.textContent).toContain('category');
    document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click();
    await fixture.whenStable();
    expect(copy).toHaveBeenLastCalledWith('category');
    expect(failure).toHaveBeenCalledWith('Could not copy the identifier.');
    ref.forceClose();
    fixture.destroy();
  });
  it('creates only missing languages, protects pending work and reloads the selected translation', async () => {
    const { fixture, ref, detail, loading, actions, creatingInfo, infoCreated, infoError } =
      setup();
    detail.set(movie());
    loading.set(false);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('button[aria-label="Add a language"]')).not.toBeNull();
    });
    document.querySelector<HTMLButtonElement>('button[aria-label="Add a language"]')!.click();
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('app-create-movie-info-modal form')).not.toBeNull();
    });
    const form = document.querySelector<HTMLFormElement>('app-create-movie-info-modal form')!;
    const submit = () =>
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    submit();
    await fixture.whenStable();
    expect(actions.createInfo).not.toHaveBeenCalled();
    document
      .querySelector<HTMLButtonElement>('app-create-movie-info-modal app-select button')!
      .click();
    await fixture.whenStable();
    const options = document.querySelectorAll<HTMLElement>('hlm-select-item');
    expect(options).toHaveLength(1);
    expect(options[0].textContent).toContain('English');
    options[0].click();
    await fixture.whenStable();
    submit();
    await fixture.whenStable();
    expect(actions.createInfo).toHaveBeenCalledExactlyOnceWith({ id: 'one', language: 'en-US' });
    expect(
      document.querySelector<HTMLButtonElement>(
        'app-create-movie-info-modal button[aria-label="Close dialog"]',
      )?.disabled ??
        document.querySelector<HTMLButtonElement>(
          'app-create-movie-info-modal app-modal-frame app-icon-button button',
        )?.disabled,
    ).toBe(true);
    submit();
    await fixture.whenStable();
    expect(actions.createInfo).toHaveBeenCalledTimes(1);
    creatingInfo.set(false);
    infoError.set({ code: 'server' });
    await fixture.whenStable();
    expect(document.querySelector('app-create-movie-info-modal')?.textContent).toContain(
      'The server could not complete creation.',
    );
    expect(document.querySelector('app-create-movie-info-modal app-select')?.textContent).toContain(
      'English',
    );
    infoError.set(null);
    submit();
    await fixture.whenStable();
    expect(actions.createInfo).toHaveBeenCalledTimes(2);
    creatingInfo.set(false);
    infoCreated.set(true);
    await fixture.whenStable();
    await vi.waitFor(() => {
      expect(document.querySelector('app-create-movie-info-modal')).toBeNull();
    });
    expect(actions.loadDetail).toHaveBeenCalledTimes(2);
    const current = movie();
    detail.set({
      ...current,
      info: {
        ...current.info,
        'en-US': { ...current.info['it-IT']!, id: 'english', title: 'New English title' },
      },
    });
    await fixture.whenStable();
    expect(document.body.textContent).toContain('New English title');
    expect(
      document.querySelector<HTMLButtonElement>('button[aria-label="Add a language"]')?.disabled,
    ).toBe(true);
    ref.forceClose();
    fixture.destroy();
  });
});
