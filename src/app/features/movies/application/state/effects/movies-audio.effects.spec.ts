import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideStore, ScannedActionsSubject, Store } from '@ngrx/store';
import { of, Subject, type Subscription } from 'rxjs';
import { moviesReducer } from '../movies.reducer';
import { moviesFeature } from '../movies.feature';
import {
  MoviesAudioEvents as events,
  MoviesAudioSaveActions as save,
} from '../actions/movies-audio.actions';
import { saveMovieAudio } from './movies-audio.effects';
import { MovieAudioMode } from '../../../domain/models/movie-audio-mode.model';
import type { MovieAudioInputModel } from '../../../domain/models/movie-audio-input.model';
import type { MovieSoundtrackTrackModel } from '../../../domain/models/movie-soundtrack-track.model';
import type { MovieSoundtracksRepositoryPort } from '../../ports/movie-soundtracks-repository.port';
import { isRequestPending } from '@shared/state/request/request-state.queries';

describe('Movie audio workflow', () => {
  const track: MovieSoundtrackTrackModel = {
    id: 'track',
    externalId: 'spotify',
    name: 'Stay',
    artist: 'Zimmer',
    path: null,
    languages: ['it-IT'],
  };
  const input: MovieAudioInputModel = {
    mode: MovieAudioMode.Soundtrack,
    movieId: 'movie',
    soundtrackId: null,
    externalId: 'spotify',
    languages: ['it-IT'],
    fileKey: 'file',
  };
  let store: Store;
  let subscription: Subscription;
  let upload: Subject<number>;
  let confirmation: Subject<MovieSoundtrackTrackModel>;
  const repository = {
    create: vi.fn<MovieSoundtracksRepositoryPort['create']>(),
    addTrack: vi.fn<MovieSoundtracksRepositoryPort['addTrack']>(),
    upload: vi.fn<MovieSoundtracksRepositoryPort['upload']>(),
    complete: vi.fn<MovieSoundtracksRepositoryPort['complete']>(),
    languages: vi.fn<MovieSoundtracksRepositoryPort['languages']>(),
  };
  beforeEach(() => {
    vi.resetAllMocks();
    upload = new Subject<number>();
    confirmation = new Subject<MovieSoundtrackTrackModel>();
    repository.create.mockReturnValue(of({ id: 'soundtrack', tracks: [track] }));
    repository.addTrack.mockReturnValue(of(track));
    repository.upload.mockImplementation(() => upload);
    repository.complete.mockImplementation(() => confirmation);
    repository.languages.mockReturnValue(of(track));
    TestBed.configureTestingModule({ providers: [provideStore({ movies: moviesReducer })] });
    store = TestBed.inject<Store>(Store);
    subscription = saveMovieAudio(
      new Actions(TestBed.inject(ScannedActionsSubject)),
      repository,
      store,
    ).subscribe((action) => {
      store.dispatch(action);
    });
    store.dispatch(events.opened({ sessionId: 'editor', soundtrackId: null, track: null }));
  });
  afterEach(() => {
    subscription.unsubscribe();
  });
  const submit = (): void => {
    store.dispatch(save.requested({ sessionId: 'editor', input }));
  };
  it('creates once, waits for the upload to finish, then confirms; ignores duplicate submits', () => {
    submit();
    submit();
    expect(repository.create).toHaveBeenCalledTimes(1);
    upload.next(60);
    expect(store.selectSignal(moviesFeature.selectAudio)().progress).toBe(60);
    expect(repository.complete).not.toHaveBeenCalled();
    upload.next(100);
    upload.complete();
    expect(repository.complete).toHaveBeenCalledWith('track');
    expect(isRequestPending(store.selectSignal(moviesFeature.selectAudioRequest)())).toBe(true);
    confirmation.next({ ...track, path: 'https://media.test/audio.mp3' });
    confirmation.complete();
    expect(store.selectSignal(moviesFeature.selectAudio)().track?.path).toBe(
      'https://media.test/audio.mp3',
    );
    expect(isRequestPending(store.selectSignal(moviesFeature.selectAudioRequest)())).toBe(false);
  });
  it('retries a failed upload using the created track, without recreating the soundtrack', () => {
    submit();
    upload.error({ code: 'network' });
    upload = new Subject<number>();
    submit();
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.upload).toHaveBeenCalledTimes(2);
    expect(repository.upload).toHaveBeenLastCalledWith('track', 'file');
  });
  it('retries confirmation without creating or uploading again', () => {
    submit();
    upload.next(100);
    upload.complete();
    confirmation.error({ code: 'network' });
    confirmation = new Subject<MovieSoundtrackTrackModel>();
    submit();
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.upload).toHaveBeenCalledTimes(1);
    expect(repository.complete).toHaveBeenCalledTimes(2);
  });
  it('cancels the upload, keeps the track checkpoint and allows a fresh upload', () => {
    submit();
    store.dispatch(events.cancelled({ sessionId: 'editor' }));
    upload.next(100);
    upload.complete();
    expect(repository.complete).not.toHaveBeenCalled();
    upload = new Subject<number>();
    submit();
    expect(repository.create).toHaveBeenCalledTimes(1);
    expect(repository.upload).toHaveBeenCalledTimes(2);
  });
  it('cancels on owner close and rejects successes and failures from the old editor', () => {
    submit();
    store.dispatch(events.closed({ sessionId: 'editor' }));
    upload.next(100);
    upload.complete();
    expect(repository.complete).not.toHaveBeenCalled();
    store.dispatch(events.opened({ sessionId: 'new', soundtrackId: null, track: null }));
    store.dispatch(save.succeeded({ sessionId: 'editor', track }));
    store.dispatch(save.failed({ sessionId: 'editor', error: { code: 'network' } }));
    expect(store.selectSignal(moviesFeature.selectAudio)().track).toBeNull();
    expect(store.selectSignal(moviesFeature.selectAudioRequest)().error).toBeNull();
  });
  it('blocks blind creation retries after an ambiguous network failure', () => {
    const creation = new Subject<{ id: string; tracks: Array<MovieSoundtrackTrackModel> }>();
    repository.create.mockReturnValue(creation);
    submit();
    creation.error({ code: 'network', status: 0 });
    submit();
    expect(store.selectSignal(moviesFeature.selectAudio)().creationUncertain).toBe(true);
    expect(repository.create).toHaveBeenCalledTimes(1);
  });
  it('creates a new version through addTrack and updates languages without uploading', () => {
    store.dispatch(
      save.requested({
        sessionId: 'editor',
        input: { ...input, mode: MovieAudioMode.Version, soundtrackId: 'soundtrack' },
      }),
    );
    expect(repository.addTrack).toHaveBeenCalledWith('soundtrack', 'spotify', ['it-IT']);
    expect(repository.create).not.toHaveBeenCalled();
    store.dispatch(events.closed({ sessionId: 'editor' }));
    store.dispatch(events.opened({ sessionId: 'languages', soundtrackId: 'soundtrack', track }));
    store.dispatch(
      save.requested({
        sessionId: 'languages',
        input: { ...input, mode: MovieAudioMode.Languages, languages: ['it-IT', 'en-US'] },
      }),
    );
    expect(repository.languages).toHaveBeenCalledWith('track', ['it-IT', 'en-US']);
    expect(repository.upload).toHaveBeenCalledTimes(1);
  });
});
