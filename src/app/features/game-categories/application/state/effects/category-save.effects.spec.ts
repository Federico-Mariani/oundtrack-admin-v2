import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { provideStore, ScannedActionsSubject, Store } from '@ngrx/store';
import { of, Subject, type Subscription, throwError } from 'rxjs';
import { gameCategoriesReducer } from '../game-categories.reducer';
import { gameCategoriesFeature } from '../game-categories.feature';
import { GAME_CATEGORIES_STATE_DEFINITION } from '../game-categories-state-definition';
import {
  CategoryEditorEvents as editor,
  CategorySaveActions as save,
} from '../actions/category-save.actions';
import { saveCategory } from './category-save.effects';
import type { CategoryManagementPort } from '../../ports/category-management.port';
import type { GameCategoryModel } from '../../../domain/models/game-category.model';
import { RequestErrorCode } from '@shared/state/request/request-error';
import { RequestStatus } from '@shared/state/request/request-status';
import { SupportedLocale } from '@shared/localization/supported-locale';
const category: GameCategoryModel = {
  id: 'category',
  image: null,
  info: { 'it-IT': { id: 'it', name: 'Film' } },
};
const translated: GameCategoryModel = {
  ...category,
  info: { ...category.info, 'en-US': { id: 'en', name: 'Movies' } },
};
describe('Category creation and upload recovery', () => {
  let store: Store, subscription: Subscription;
  const repository = {
    saveName: vi.fn<CategoryManagementPort['saveName']>(),
    upload: vi.fn<CategoryManagementPort['upload']>(),
    complete: vi.fn<CategoryManagementPort['complete']>(),
  };
  const command = {
    names: [
      { language: SupportedLocale.Italian, name: 'Film' },
      { language: SupportedLocale.English, name: 'Movies' },
    ],
    fileKey: 'file',
  };
  const state = () => store.selectSignal(gameCategoriesFeature['selectGame-categoriesState'])();
  const submit = (requestId = 'request') => {
    store.dispatch(save.requested({ sessionId: 'editor', requestId, command }));
  };
  beforeEach(() => {
    vi.resetAllMocks();
    repository.saveName.mockReturnValueOnce(of(category)).mockReturnValue(of(translated));
    repository.upload.mockReturnValue(
      of({ progress: 42, key: 'key' }, { progress: 100, key: 'key' }),
    );
    repository.complete.mockReturnValue(of({ ...translated, image: 'signed-icon' }));
    TestBed.configureTestingModule({
      providers: [provideStore({ [GAME_CATEGORIES_STATE_DEFINITION.key]: gameCategoriesReducer })],
    });
    store = TestBed.inject<Store>(Store);
    subscription = saveCategory(
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
  it('creates once, adds translations to the returned identity and confirms the icon', () => {
    submit();
    expect(repository.saveName.mock.calls).toEqual([
      [undefined, 'Film', SupportedLocale.Italian],
      ['category', 'Movies', SupportedLocale.English],
    ]);
    expect(repository.complete).toHaveBeenCalledWith('category', 'file', 'key');
    expect(state().saveRequest.status).toBe(RequestStatus.Success);
    expect(state().categories[0]?.image).toBe('signed-icon');
  });
  it('retries confirmation without repeating names or PUT', () => {
    repository.complete
      .mockReturnValueOnce(throwError(() => ({ code: RequestErrorCode.Network })))
      .mockReturnValue(of(translated));
    submit();
    expect(state().uploadedCategoryFile).toBe('file');
    submit('retry');
    expect(repository.saveName).toHaveBeenCalledTimes(2);
    expect(repository.upload).toHaveBeenCalledOnce();
    expect(repository.complete).toHaveBeenCalledTimes(2);
    expect(state().saveRequest.status).toBe(RequestStatus.Success);
  });
  it('retries a failed transfer without duplicating category creation', () => {
    repository.upload
      .mockReturnValueOnce(throwError(() => ({ code: RequestErrorCode.Network })))
      .mockReturnValue(of({ progress: 100, key: 'retry-key' }));
    submit();
    submit('retry');
    expect(repository.saveName).toHaveBeenCalledTimes(2);
    expect(repository.complete).toHaveBeenCalledWith('category', 'file', 'retry-key');
  });
  it('blocks blind duplicate creation after an ambiguous response', () => {
    repository.saveName
      .mockReset()
      .mockReturnValue(throwError(() => ({ code: RequestErrorCode.Network })));
    submit();
    expect(state().categoryCreationUncertain).toBe(true);
    submit('retry');
    expect(repository.saveName).toHaveBeenCalledOnce();
  });
  it('retains successful translations when a later language fails', () => {
    repository.saveName
      .mockReset()
      .mockReturnValueOnce(of(category))
      .mockReturnValueOnce(throwError(() => ({ code: RequestErrorCode.Network })))
      .mockReturnValue(of(translated));
    submit();
    expect(state().preparedCategory?.id).toBe(category.id);
    submit('retry');
    expect(repository.saveName.mock.calls.map((call) => call[0])).toEqual([
      undefined,
      'category',
      'category',
    ]);
    expect(state().saveRequest.status).toBe(RequestStatus.Success);
  });
  it('ignores duplicate submissions and cancels a closed session', () => {
    const pending = new Subject<GameCategoryModel>();
    repository.saveName.mockReset().mockReturnValue(pending);
    submit();
    submit('duplicate');
    expect(repository.saveName).toHaveBeenCalledOnce();
    store.dispatch(editor.closed({ sessionId: 'editor' }));
    expect(pending.observed).toBe(false);
    store.dispatch(
      save.failed({
        sessionId: 'editor',
        requestId: 'request',
        error: { code: RequestErrorCode.Network },
        uncertain: true,
      }),
    );
    expect(state().categoryCreationUncertain).toBe(false);
    expect(state().saveRequest.status).toBe(RequestStatus.Idle);
  });
});
