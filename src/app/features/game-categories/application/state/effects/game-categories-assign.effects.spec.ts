import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideStore, ScannedActionsSubject, Store } from '@ngrx/store';
import { Subject, type Subscription, of } from 'rxjs';
import { gameCategoriesReducer } from '../game-categories.reducer';
import { gameCategoriesFeature } from '../game-categories.feature';
import { GAME_CATEGORIES_STATE_DEFINITION } from '../game-categories-state-definition';
import {
  GameCategoriesAssignActions as assign,
  GameCategoriesEditorEvents as editor,
} from '../actions/game-categories-assign.actions';
import { GameCategoriesGetAllActions as load } from '../actions/game-categories-get-all.actions';
import { assignGameCategories } from './game-categories-assign.effects';
import type { GameCategoriesRepositoryPort } from '../../ports/game-categories-repository.port';
import { GameCategoryOwnerType } from '../../../domain/values/game-category-owner';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { RequestStatus } from '@shared/state/request/request-status';
describe('Category assignment lifecycle', () => {
  let store: Store;
  let response: Subject<void>;
  let subscription: Subscription;
  const repository = {
    getAll: () => of([]),
    setForOwner: vi.fn<GameCategoriesRepositoryPort['setForOwner']>(),
  };
  const command = {
    owner: { id: 'movie', type: GameCategoryOwnerType.Movie },
    categoryIds: ['category'],
  };
  const state = () => store.selectSignal(gameCategoriesFeature.selectAssignmentRequest)();
  const submit = (requestId = 'request', sessionId = 'editor') => {
    store.dispatch(assign.requested({ sessionId, requestId, command }));
  };
  beforeEach(() => {
    repository.setForOwner.mockReset();
    response = new Subject();
    repository.setForOwner.mockReturnValue(response);
    TestBed.configureTestingModule({
      providers: [provideStore({ [GAME_CATEGORIES_STATE_DEFINITION.key]: gameCategoriesReducer })],
    });
    store = TestBed.inject<Store>(Store);
    subscription = assignGameCategories(
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
  it('ignores repeated saves while preserving independent list loading', () => {
    store.dispatch(load.requested());
    submit();
    submit('duplicate');
    expect(repository.setForOwner).toHaveBeenCalledTimes(1);
    response.next();
    expect(state().status).toBe(RequestStatus.Success);
    expect(store.selectSignal(gameCategoriesFeature.selectLoadRequest)().status).toBe(
      RequestStatus.Pending,
    );
  });
  it('reports errors and permits retry', () => {
    submit();
    response.error({ code: RequestErrorCode.Network });
    expect(state().error?.code).toBe(RequestErrorCode.Network);
    repository.setForOwner.mockReturnValue(of(undefined));
    submit('retry');
    expect(state().status).toBe(RequestStatus.Success);
  });
  it('cancels a closed editor and rejects stale successes and errors', () => {
    submit();
    store.dispatch(editor.closed({ sessionId: 'editor' }));
    expect(response.observed).toBe(false);
    store.dispatch(editor.opened({ sessionId: 'new' }));
    store.dispatch(assign.succeeded({ sessionId: 'editor', requestId: 'request' }));
    store.dispatch(
      assign.failed({
        sessionId: 'editor',
        requestId: 'request',
        error: { code: RequestErrorCode.Network },
      }),
    );
    expect(state().status).toBe(RequestStatus.Idle);
    repository.setForOwner.mockReturnValue(of(undefined));
    submit('new-request', 'new');
    expect(state().status).toBe(RequestStatus.Success);
  });
});
