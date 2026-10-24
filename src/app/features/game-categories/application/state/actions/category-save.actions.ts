import { createActionGroup, props } from '@ngrx/store';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { SaveCategoryCommand } from '../../commands/save-category.command';
import type { CategorySaveEvent } from '../workflows/category-save-event.workflow';
import { GAME_CATEGORIES_STATE_DEFINITION } from '../game-categories-state-definition';
import { GameCategoriesRequestOperation } from '../game-categories-request-operation';
export const CategoryEditorEvents = createActionGroup({
  source:
    `${GAME_CATEGORIES_STATE_DEFINITION.source} ${GameCategoriesRequestOperation.Manage}` as const,
  events: {
    Opened: props<{ sessionId: string }>(),
    Closed: props<{ sessionId: string }>(),
    Progress: props<{ sessionId: string; requestId: string; event: CategorySaveEvent }>(),
  },
});
export const CategorySaveActions = createRequestActions<
  { sessionId: string; requestId: string; command: SaveCategoryCommand },
  { sessionId: string; requestId: string },
  { sessionId: string; requestId: string; error: RequestError; uncertain: boolean }
>(GAME_CATEGORIES_STATE_DEFINITION.source, GameCategoriesRequestOperation.Save);
