import { SoundtrackOwnerType } from '../../../domain/ownership/soundtrack-owner';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideStore, ScannedActionsSubject, Store } from '@ngrx/store';
import { of, Subject, type Subscription } from 'rxjs';
import { soundtracksReducer } from '../soundtracks.reducer';
import { soundtracksFeature } from '../soundtracks.feature';
import {
  SoundtracksAudioEvents as events,
  SoundtracksAudioSaveActions as save,
} from '../actions/soundtracks-audio.actions';
import { saveSoundtracksAudio } from './soundtracks-audio.effects';
import { SoundtrackEditorMode } from '../../workflows/soundtrack-editor.mode';
import type { SaveSoundtrackCommand } from '../../commands/save-soundtrack.command';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';
import type { SoundtracksRepositoryPort } from '../../ports/soundtracks-repository.port';
import { isRequestPending } from '@shared/state/request/request-state.queries';

describe.each([SoundtrackOwnerType.Movie, SoundtrackOwnerType.TvSeries])(
  'Soundtrack workflow for %s',
  (ownerType) => {
    const track: SoundtrackTrackModel = {
      id: 'track',
      externalId: 'spotify',
      name: 'Stay',
      artist: 'Zimmer',
      path: null,
      languages: ['it-IT'],
    };
    const input: SaveSoundtrackCommand = {
      mode: SoundtrackEditorMode.Soundtrack,
      owner: { type: ownerType, id: 'owner' },
      soundtrackId: null,
      externalId: 'spotify',
      languages: ['it-IT'],
      fileKey: 'file',
    };
    let store: Store;
    let subscription: Subscription;
    let upload: Subject<number>;
    let confirmation: Subject<SoundtrackTrackModel>;
    const repository = {
      create: vi.fn<SoundtracksRepositoryPort['create']>(),
      addTrack: vi.fn<SoundtracksRepositoryPort['addTrack']>(),
      upload: vi.fn<SoundtracksRepositoryPort['upload']>(),
      complete: vi.fn<SoundtracksRepositoryPort['complete']>(),
      languages: vi.fn<SoundtracksRepositoryPort['languages']>(),
    };
    beforeEach(() => {
      vi.resetAllMocks();
      upload = new Subject<number>();
      confirmation = new Subject<SoundtrackTrackModel>();
      repository.create.mockReturnValue(of({ id: 'soundtrack', tracks: [track] }));
      repository.addTrack.mockReturnValue(of(track));
      repository.upload.mockImplementation(() => upload);
      repository.complete.mockImplementation(() => confirmation);
      repository.languages.mockReturnValue(of(track));
      TestBed.configureTestingModule({
        providers: [provideStore({ soundtracks: soundtracksReducer })],
      });
      store = TestBed.inject<Store>(Store);
      subscription = saveSoundtracksAudio(
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
      expect(repository.create).toHaveBeenCalledWith(input.owner, 'spotify', ['it-IT']);
      upload.next(60);
      expect(store.selectSignal(soundtracksFeature.selectAudio)().progress).toBe(60);
      expect(repository.complete).not.toHaveBeenCalled();
      upload.next(100);
      upload.complete();
      expect(repository.complete).toHaveBeenCalledWith('track');
      expect(isRequestPending(store.selectSignal(soundtracksFeature.selectAudioRequest)())).toBe(
        true,
      );
      confirmation.next({ ...track, path: 'https://media.test/audio.mp3' });
      confirmation.complete();
      expect(store.selectSignal(soundtracksFeature.selectAudio)().track?.path).toBe(
        'https://media.test/audio.mp3',
      );
      expect(isRequestPending(store.selectSignal(soundtracksFeature.selectAudioRequest)())).toBe(
        false,
      );
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
      confirmation = new Subject<SoundtrackTrackModel>();
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
      expect(store.selectSignal(soundtracksFeature.selectAudio)().track).toBeNull();
      expect(store.selectSignal(soundtracksFeature.selectAudioRequest)().error).toBeNull();
    });
    it('blocks blind creation retries after an ambiguous network failure', () => {
      const creation = new Subject<{ id: string; tracks: Array<SoundtrackTrackModel> }>();
      repository.create.mockReturnValue(creation);
      submit();
      creation.error({ code: 'network', status: 0 });
      submit();
      expect(store.selectSignal(soundtracksFeature.selectAudio)().creationUncertain).toBe(true);
      expect(repository.create).toHaveBeenCalledTimes(1);
    });
    it('creates a new version through addTrack and updates languages without uploading', () => {
      store.dispatch(
        save.requested({
          sessionId: 'editor',
          input: { ...input, mode: SoundtrackEditorMode.Version, soundtrackId: 'soundtrack' },
        }),
      );
      expect(repository.addTrack).toHaveBeenCalledWith('soundtrack', 'spotify', ['it-IT']);
      expect(repository.create).not.toHaveBeenCalled();
      store.dispatch(events.closed({ sessionId: 'editor' }));
      store.dispatch(events.opened({ sessionId: 'languages', soundtrackId: 'soundtrack', track }));
      store.dispatch(
        save.requested({
          sessionId: 'languages',
          input: { ...input, mode: SoundtrackEditorMode.Languages, languages: ['it-IT', 'en-US'] },
        }),
      );
      expect(repository.languages).toHaveBeenCalledWith('track', ['it-IT', 'en-US']);
      expect(repository.upload).toHaveBeenCalledTimes(1);
    });
  },
);
