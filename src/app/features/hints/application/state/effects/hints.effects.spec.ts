import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideStore, ScannedActionsSubject, Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { hintsReducer } from '../hints.reducer';
import { hintsFeature } from '../hints.feature';
import {
  HintsPanelEvents as panel,
  HintsLoadActions as load,
  HintsSaveActions as save,
} from '../actions/hints.actions';
import { loadHints, saveHint } from './hints.effects';
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
});
