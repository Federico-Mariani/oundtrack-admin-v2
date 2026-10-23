import { createActionGroup, props } from '@ngrx/store';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { SetOwnerCategoriesCommand } from '../../commands/set-owner-categories.command';
import { GAME_CATEGORIES_STATE_DEFINITION } from '../game-categories-state-definition';
import { GameCategoriesRequestOperation } from '../game-categories-request-operation';
export const GameCategoriesEditorEvents = createActionGroup({
  source:
    `${GAME_CATEGORIES_STATE_DEFINITION.source} ${GameCategoriesRequestOperation.Editor}` as const,
  events: { Opened: props<{ sessionId: string }>(), Closed: props<{ sessionId: string }>() },
});
export const GameCategoriesAssignActions = createRequestActions<
  { sessionId: string; requestId: string; command: SetOwnerCategoriesCommand },
  { sessionId: string; requestId: string },
  { sessionId: string; requestId: string; error: RequestError }
>(GAME_CATEGORIES_STATE_DEFINITION.source, GameCategoriesRequestOperation.Assign);
