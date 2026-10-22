import { HintType } from '../../../domain/values/hint-type';
import { HintSavePhase } from '../../workflows/hint-save.phase';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideStore, ScannedActionsSubject, Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { hintsReducer } from '../hints.reducer';
import { hintsFeature } from '../hints.feature';
import {
  HintsIconsActions as icons,
  HintsPanelEvents as panel,
  HintsLoadActions as load,
  HintsSaveActions as save,
} from '../actions/hints.actions';
import { loadHints, saveHint, loadHintIcons } from './hints.effects';
import type { HintsRepositoryPort } from '../../ports/hints-repository.port';
import type { HintModel } from '../../../domain/models/hint.model';
import { HintEditorMode } from '../../workflows/hint-editor.mode';
import { createHintCommand, hintFixture } from '../../../testing/hint.fixtures';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { isRequestPending } from '@shared/state/request/request-state.queries';
describe('Hints workflow concurrency and lifecycle', () => {
  let store: Store;
  let subscription: Subscription;
  let reading: Subject<ReadonlyArray<HintModel>>;
  let writing: Subject<HintModel | null>;
  const repository = {
    getIcons: vi.fn(),
    uploadImage: vi.fn<HintsRepositoryPort['uploadImage']>(),
    completeImage: vi.fn<HintsRepositoryPort['completeImage']>(),
    getByOwner: vi.fn<HintsRepositoryPort['getByOwner']>(),
    save: vi.fn<HintsRepositoryPort['save']>(),
  };
  const owner = createHintCommand().owner;
  const state = () => store.selectSignal(hintsFeature.selectHintsState)();
  const read = (requestId = 'load') => {
    store.dispatch(load.requested({ sessionId: 'panel', requestId, ownerId: owner.id }));
  };
  const submit = (requestId = 'save') => {
    store.dispatch(save.requested({ sessionId: 'panel', requestId, command: createHintCommand() }));
  };
  beforeEach(() => {
    vi.resetAllMocks();
    reading = new Subject();
    writing = new Subject();
    repository.getByOwner.mockReturnValue(reading);
    repository.save.mockReturnValue(writing);
    TestBed.configureTestingModule({ providers: [provideStore({ hints: hintsReducer })] });
    store = TestBed.inject<Store>(Store);
    const actions = new Actions(TestBed.inject(ScannedActionsSubject));
    subscription = new Subscription();
    subscription.add(
      loadHintIcons(actions, repository, store).subscribe((action) => {
        store.dispatch(action);
      }),
    );
    subscription.add(
      loadHints(actions, repository, store).subscribe((action) => {
        store.dispatch(action);
      }),
    );
    subscription.add(
      saveHint(actions, repository, store).subscribe((action) => {
        store.dispatch(action);
      }),
    );
    store.dispatch(panel.opened({ sessionId: 'panel', owner }));
  });
  afterEach(() => {
    subscription.unsubscribe();
  });
  it('isolates icon loading errors and rejects responses from a closed panel', () => {
    const response = new Subject<Record<string, string>>();
    repository.getIcons.mockReturnValue(response);
    store.dispatch(icons.requested({ sessionId: 'panel', requestId: 'icons' }));
    response.error({ code: RequestErrorCode.Network });
    expect(state().iconsRequest.error?.code).toBe(RequestErrorCode.Network);
    expect(state().saveRequest.error).toBeNull();
    const retry = new Subject<Record<string, string>>();
    repository.getIcons.mockReturnValue(retry);
    store.dispatch(icons.requested({ sessionId: 'panel', requestId: 'retry' }));
    store.dispatch(panel.closed({ sessionId: 'panel' }));
    retry.next({ actor: 'stale' });
    expect(state().icons).toEqual({});
  });
  it('ignores duplicate submissions and updates the list without a reload', () => {
    submit();
    submit('duplicate');
    expect(repository.save).toHaveBeenCalledTimes(1);
    writing.next(hintFixture());
    expect(state().hints).toEqual([hintFixture()]);
    expect(isRequestPending(state().saveRequest)).toBe(false);
    expect(repository.getByOwner).not.toHaveBeenCalled();
  });
  it('cancels old reads when a newer read starts', () => {
    read();
    const newer = new Subject<ReadonlyArray<HintModel>>();
    repository.getByOwner.mockReturnValue(newer);
    read('new');
    reading.next([hintFixture()]);
    expect(state().hints).toEqual([]);
    newer.next([hintFixture()]);
    expect(state().hints).toHaveLength(1);
  });
  it('prevents an in-flight read from overwriting a newly saved hint', () => {
    read();
    submit();
    writing.next(hintFixture());
    reading.next([]);
    expect(state().hints).toEqual([hintFixture()]);
  });
  it('keeps content visible during refresh and after refresh failure', () => {
    read();
    reading.next([hintFixture()]);
    reading.complete();
    reading = new Subject();
    repository.getByOwner.mockReturnValue(reading);
    read('refresh');
    expect(state().loaded).toBe(true);
    expect(state().hints).toHaveLength(1);
    reading.error({ code: RequestErrorCode.Network });
    expect(state().loadRequest.error?.code).toBe(RequestErrorCode.Network);
    expect(state().hints).toHaveLength(1);
  });
  it('keeps mutation errors separate and permits retry', () => {
    submit();
    writing.error({ code: RequestErrorCode.NotFound, status: 404 });
    expect(state().saveRequest.error?.status).toBe(404);
    expect(state().loadRequest.error).toBeNull();
    writing = new Subject();
    repository.save.mockReturnValue(writing);
    submit('retry');
    writing.next(hintFixture());
    expect(state().hints).toHaveLength(1);
  });
  it('discards responses after the owner modal closes', () => {
    read();
    submit();
    store.dispatch(panel.closed({ sessionId: 'panel' }));
    writing.next(hintFixture());
    reading.next([hintFixture()]);
    expect(state().hints).toEqual([]);
    expect(state().sessionId).toBeNull();
  });
  it('ignores stale close events without cancelling the active save', () => {
    submit();
    store.dispatch(panel.closed({ sessionId: 'old' }));
    writing.next(hintFixture());
    expect(state().hints).toHaveLength(1);
  });
  it('does not reset or refresh a pending mutation', () => {
    submit();
    store.dispatch(save.reset());
    read();
    expect(repository.getByOwner).not.toHaveBeenCalled();
    writing.next(hintFixture());
    expect(state().hints).toHaveLength(1);
  });
  it('cannot load or save for a different owner', () => {
    store.dispatch(load.requested({ sessionId: 'panel', requestId: 'wrong', ownerId: 'wrong' }));
    store.dispatch(
      save.requested({
        sessionId: 'panel',
        requestId: 'wrong',
        command: { ...createHintCommand(), owner: { ...owner, id: 'wrong' } },
      }),
    );
    expect(repository.save).not.toHaveBeenCalled();
    expect(repository.getByOwner).not.toHaveBeenCalled();
  });
  it('removes a hint only after successful deletion', () => {
    read();
    reading.next([hintFixture()]);
    reading.complete();
    store.dispatch(
      save.requested({
        sessionId: 'panel',
        requestId: 'delete',
        command: { mode: HintEditorMode.Delete, owner, hintId: 'hint' },
      }),
    );
    expect(state().hints).toHaveLength(1);
    writing.next(null);
    expect(state().hints).toEqual([]);
  });
  const imageCommand = () =>
    ({
      mode: HintEditorMode.Create,
      owner,
      type: HintType.Actor,
      language: hintFixture().info[0].language,
      fileKey: 'image',
    }) as const;
  const visualHint = () => ({ ...hintFixture(), type: HintType.Actor });
  const submitImage = (requestId = 'image') => {
    store.dispatch(save.requested({ sessionId: 'panel', requestId, command: imageCommand() }));
  };
  it('waits for PUT completion before confirming and keeps save pending through confirmation', () => {
    const upload = new Subject<number>(),
      confirmation = new Subject<HintModel>();
    repository.uploadImage.mockReturnValue(upload);
    repository.completeImage.mockReturnValue(confirmation);
    submitImage();
    writing.next(visualHint());
    writing.complete();
    upload.next(42);
    expect(state().progress).toBe(42);
    expect(state().hints).toEqual([visualHint()]);
    expect(repository.completeImage).not.toHaveBeenCalled();
    upload.next(100);
    expect(repository.completeImage).not.toHaveBeenCalled();
    upload.complete();
    expect(state().phase).toBe(HintSavePhase.Confirming);
    expect(isRequestPending(state().saveRequest)).toBe(true);
    const result = {
      ...visualHint(),
      info: [{ ...hintFixture().info[0], image: 'https://media.test/image.jpg' }],
    };
    confirmation.next(result);
    confirmation.complete();
    expect(state().hints).toEqual([result]);
    expect(isRequestPending(state().saveRequest)).toBe(false);
  });
  it('retries a failed PUT without creating the hint twice', () => {
    const upload = new Subject<number>();
    repository.uploadImage.mockReturnValue(upload);
    submitImage();
    writing.next(visualHint());
    writing.complete();
    upload.error({ code: RequestErrorCode.Network });
    expect(state().preparedHint?.id).toBe('hint');
    expect(state().creationUncertain).toBe(false);
    const retry = new Subject<number>();
    repository.uploadImage.mockReturnValue(retry);
    submitImage('retry');
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.uploadImage).toHaveBeenCalledTimes(2);
  });
  it('retries confirmation without uploading the same file again', () => {
    const upload = new Subject<number>(),
      confirmation = new Subject<HintModel>();
    repository.uploadImage.mockReturnValue(upload);
    repository.completeImage.mockReturnValue(confirmation);
    submitImage();
    writing.next(visualHint());
    writing.complete();
    upload.complete();
    confirmation.error({ code: RequestErrorCode.Network });
    repository.completeImage.mockReturnValue(new Subject());
    submitImage('retry');
    expect(repository.save).toHaveBeenCalledTimes(1);
    expect(repository.uploadImage).toHaveBeenCalledTimes(1);
    expect(repository.completeImage).toHaveBeenCalledTimes(2);
  });
  it('requests a fresh upload after the server rejects the uploaded object', () => {
    const upload = new Subject<number>(),
      confirmation = new Subject<HintModel>();
    repository.uploadImage.mockReturnValue(upload);
    repository.completeImage.mockReturnValue(confirmation);
    submitImage();
    writing.next(visualHint());
    writing.complete();
    upload.complete();
    confirmation.error({ code: RequestErrorCode.Conflict, status: 409 });
    repository.uploadImage.mockReturnValue(new Subject());
    submitImage('retry');
    expect(repository.uploadImage).toHaveBeenCalledTimes(2);
  });
  it('replaces an existing visual hint without creating or patching its text', () => {
    read();
    reading.next([visualHint()]);
    reading.complete();
    repository.uploadImage.mockReturnValue(new Subject());
    store.dispatch(
      save.requested({
        sessionId: 'panel',
        requestId: 'replace',
        command: {
          mode: HintEditorMode.Image,
          owner,
          hintId: 'hint',
          type: HintType.Actor,
          fileKey: 'image',
        },
      }),
    );
    expect(repository.save).not.toHaveBeenCalled();
    expect(repository.uploadImage).toHaveBeenCalledWith('hint', 'image');
  });
  it('rejects uploads for a text-only type', () => {
    store.dispatch(
      save.requested({
        sessionId: 'panel',
        requestId: 'invalid',
        command: { ...imageCommand(), type: HintType.Plot },
      }),
    );
    expect(repository.save).not.toHaveBeenCalled();
    expect(repository.uploadImage).not.toHaveBeenCalled();
    expect(state().saveRequest.error?.code).toBe(RequestErrorCode.Validation);
  });
  it('blocks blind resubmission after an ambiguous create failure', () => {
    submitImage();
    writing.error({ code: RequestErrorCode.Network });
    expect(state().creationUncertain).toBe(true);
    submitImage('retry');
    expect(repository.save).toHaveBeenCalledTimes(1);
  });
  it('cancels an active upload when its panel closes and discards late progress', () => {
    const upload = new Subject<number>();
    repository.uploadImage.mockReturnValue(upload);
    submitImage();
    writing.next(visualHint());
    writing.complete();
    store.dispatch(panel.closed({ sessionId: 'panel' }));
    upload.next(90);
    upload.complete();
    expect(state().progress).toBeNull();
    expect(repository.completeImage).not.toHaveBeenCalled();
  });
});
