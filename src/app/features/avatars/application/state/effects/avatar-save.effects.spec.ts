import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideStore, ScannedActionsSubject, Store } from '@ngrx/store';
import { of, Subject, type Subscription, throwError } from 'rxjs';
import { avatarsReducer } from '../avatars.reducer';
import { avatarsFeature } from '../avatars.feature';
import { AVATARS_STATE_DEFINITION } from '../avatars-state-definition';
import {
  AvatarEditorEvents as editor,
  AvatarSaveActions as save,
} from '../actions/avatar-save.actions';
import { AvatarsLoadActions as load } from '../actions/avatars-load.actions';
import { saveAvatar } from './avatar-save.effects';
import type { AvatarsRepositoryPort } from '../../ports/avatars-repository.port';
import type { AvatarModel } from '../../../domain/models/avatar.model';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { RequestStatus } from '@shared/state/request/request-status';
const avatar: AvatarModel = { id: 'avatar', path: 'signed-image', createdAt: 0, updatedAt: 1 };
describe('Avatar upload recovery and concurrency', () => {
  let store: Store, subscription: Subscription;
  const repository = {
    getAll: vi.fn<AvatarsRepositoryPort['getAll']>(),
    upload: vi.fn<AvatarsRepositoryPort['upload']>(),
    complete: vi.fn<AvatarsRepositoryPort['complete']>(),
  };
  const state = () => store.selectSignal(avatarsFeature.selectAvatarsState)();
  const submit = (requestId = 'request', fileKey = 'file', avatarId?: string) => {
    store.dispatch(
      save.requested({ sessionId: 'editor', requestId, command: { fileKey, avatarId } }),
    );
  };
  beforeEach(() => {
    vi.resetAllMocks();
    repository.upload.mockReturnValue(
      of({ progress: 42, key: 'key' }, { progress: 100, key: 'key' }),
    );
    repository.complete.mockReturnValue(of(avatar));
    TestBed.configureTestingModule({
      providers: [provideStore({ [AVATARS_STATE_DEFINITION.key]: avatarsReducer })],
    });
    store = TestBed.inject<Store>(Store);
    subscription = saveAvatar(
      new Actions(TestBed.inject(ScannedActionsSubject)),
      repository,
      store,
    ).subscribe((action) => {
      store.dispatch(action);
    });
    store.dispatch(editor.opened({ sessionId: 'editor' }));
  });
  afterEach(() => {
    subscription.unsubscribe();
  });
  it('creates only after upload and waits for confirmation to finish', () => {
    const pending = new Subject<AvatarModel>();
    repository.complete.mockReturnValue(pending);
    submit();
    expect(state().progress).toBe(100);
    expect(state().saveRequest.status).toBe(RequestStatus.Pending);
    expect(state().avatars).toEqual([]);
    pending.next(avatar);
    pending.complete();
    expect(state().saveRequest.status).toBe(RequestStatus.Success);
    expect(state().avatars).toEqual([avatar]);
  });
  it('retries confirmation without repeating PUT', () => {
    repository.complete
      .mockReturnValueOnce(throwError(() => ({ code: RequestErrorCode.Network })))
      .mockReturnValue(of(avatar));
    submit();
    submit('retry');
    expect(repository.upload).toHaveBeenCalledOnce();
    expect(repository.complete).toHaveBeenCalledTimes(2);
    expect(state().avatars).toHaveLength(1);
  });
  it('passes the existing identity for replacements', () => {
    submit('request', 'file', 'avatar');
    expect(repository.complete).toHaveBeenCalledWith('file', 'key', 'avatar');
  });
  it('reuploads when the file changes or confirmation rejects its metadata', () => {
    repository.complete
      .mockReturnValueOnce(throwError(() => ({ code: RequestErrorCode.BadRequest })))
      .mockReturnValue(of(avatar));
    submit();
    submit('retry');
    expect(repository.upload).toHaveBeenCalledTimes(2);
    store.dispatch(editor.opened({ sessionId: 'editor' }));
    repository.complete.mockReturnValueOnce(throwError(() => ({ code: RequestErrorCode.Network })));
    submit('again');
    submit('new', 'other-file');
    expect(repository.upload).toHaveBeenLastCalledWith('other-file');
  });
  it('keeps unrelated load status when saving fails', () => {
    store.dispatch(load.requested());
    repository.upload.mockReturnValue(throwError(() => ({ code: RequestErrorCode.Network })));
    submit();
    expect(state().loadRequest.status).toBe(RequestStatus.Pending);
    expect(state().saveRequest.status).toBe(RequestStatus.Error);
  });
  it('blocks duplicate submits and discards late results after close', () => {
    const pending = new Subject<AvatarModel>();
    repository.complete.mockReturnValue(pending);
    submit();
    submit('duplicate');
    expect(repository.upload).toHaveBeenCalledOnce();
    store.dispatch(editor.closed({ sessionId: 'editor' }));
    expect(pending.observed).toBe(false);
    store.dispatch(save.succeeded({ sessionId: 'editor', requestId: 'request', avatar }));
    expect(state().avatars).toEqual([]);
    expect(state().saveRequest.status).toBe(RequestStatus.Idle);
  });
});
