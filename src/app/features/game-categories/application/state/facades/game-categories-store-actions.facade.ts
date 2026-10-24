import { CategoryEditorEvents, CategorySaveActions } from '../actions/category-save.actions';
import type { SaveCategoryCommand } from '../../commands/save-category.command';
import {
  GameCategoriesAssignActions,
  GameCategoriesEditorEvents,
} from '../actions/game-categories-assign.actions';
import type { SetOwnerCategoriesCommand } from '../../commands/set-owner-categories.command';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { GameCategoriesGetAllActions } from '../actions/game-categories-get-all.actions';

@Injectable({ providedIn: 'root' })
export class GameCategoriesStoreActionsFacade {
  private readonly store = inject(Store);

  openEditor(sessionId: string): void {
    this.store.dispatch(CategoryEditorEvents.opened({ sessionId }));
  }
  closeEditor(sessionId: string): void {
    this.store.dispatch(CategoryEditorEvents.closed({ sessionId }));
  }
  saveCategory(sessionId: string, requestId: string, command: SaveCategoryCommand): void {
    this.store.dispatch(CategorySaveActions.requested({ sessionId, requestId, command }));
  }
  openAssignment(sessionId: string): void {
    this.store.dispatch(GameCategoriesEditorEvents.opened({ sessionId }));
  }
  closeAssignment(sessionId: string): void {
    this.store.dispatch(GameCategoriesEditorEvents.closed({ sessionId }));
  }
  assign(sessionId: string, requestId: string, command: SetOwnerCategoriesCommand): void {
    this.store.dispatch(GameCategoriesAssignActions.requested({ sessionId, requestId, command }));
  }
  getAll(): void {
    this.store.dispatch(GameCategoriesGetAllActions.requested());
  }

  resetGetAll(): void {
    this.store.dispatch(GameCategoriesGetAllActions.reset());
  }
}
