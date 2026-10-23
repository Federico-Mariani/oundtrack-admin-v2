import type { GameCategoryModel } from '../../domain/models/game-category.model';
import type { RequestState } from '@shared/state/request/request-state';
import type { RequestError } from '@shared/state/request/request-error';
import { idleRequest } from '@shared/state/request/request-state.transitions';

export interface GameCategoriesState {
  readonly loaded: boolean;
  readonly assignmentSessionId: string | null;
  readonly assignmentId: string | null;
  readonly assignmentRequest: RequestState<RequestError>;
  readonly categories: ReadonlyArray<GameCategoryModel>;
  readonly loadRequest: RequestState<RequestError>;
}

export const initialGameCategoriesState: GameCategoriesState = {
  loaded: false,
  assignmentSessionId: null,
  assignmentId: null,
  assignmentRequest: idleRequest(),
  categories: [],
  loadRequest: idleRequest(),
};
