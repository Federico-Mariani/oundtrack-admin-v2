import { CategorySavePhase } from '../workflows/category-save.phase';
import type { GameCategoryModel } from '../../domain/models/game-category.model';
import type { RequestState } from '@shared/state/request/request-state';
import type { RequestError } from '@shared/state/request/request-error';
import { idleRequest } from '@shared/state/request/request-state.transitions';

export interface GameCategoriesState {
  readonly editorSessionId: string | null;
  readonly saveId: string | null;
  readonly saveRequest: RequestState<RequestError>;
  readonly preparedCategory: GameCategoryModel | null;
  readonly categoryProgress: number | null;
  readonly categoryPhase: CategorySavePhase;
  readonly uploadedCategoryFile: string | null;
  readonly categoryUploadKey: string | null;
  readonly categoryCreationUncertain: boolean;
  readonly loaded: boolean;
  readonly assignmentSessionId: string | null;
  readonly assignmentId: string | null;
  readonly assignmentRequest: RequestState<RequestError>;
  readonly categories: ReadonlyArray<GameCategoryModel>;
  readonly loadRequest: RequestState<RequestError>;
}

export const initialGameCategoriesState: GameCategoriesState = {
  editorSessionId: null,
  saveId: null,
  saveRequest: idleRequest(),
  preparedCategory: null,
  categoryProgress: null,
  categoryPhase: CategorySavePhase.Idle,
  uploadedCategoryFile: null,
  categoryUploadKey: null,
  categoryCreationUncertain: false,
  loaded: false,
  assignmentSessionId: null,
  assignmentId: null,
  assignmentRequest: idleRequest(),
  categories: [],
  loadRequest: idleRequest(),
};
