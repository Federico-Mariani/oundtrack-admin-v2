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
