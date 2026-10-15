import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import type { GameCategoriesState } from '../game-categories.state';
import { GameCategoriesLoadActions } from '../actions/game-categories-load.actions';
import {
  failedRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';
import { GameCategoriesLoadApiActions } from '../actions/api/game-categories-load-api.actions';

export const gameCategoriesLoadReducer: Array<
  ReducerTypes<GameCategoriesState, ReadonlyArray<ActionCreator>>
> = [
  on(GameCategoriesLoadActions.gameCategoriesLoadRequested, (state): GameCategoriesState => ({
    ...state,
    categories: [],
    loadRequest: pendingRequest(),
  })),
  on(
    GameCategoriesLoadApiActions.gameCategoriesLoaded,
    (state, { categories }): GameCategoriesState => ({
      ...state,
      categories: categories,
      loadRequest: succeededRequest(),
    }),
  ),
  on(
    GameCategoriesLoadApiActions.gameCategoriesLoadFailed,
    (state, { error }): GameCategoriesState => ({ ...state, loadRequest: failedRequest(error) }),
  ),
];
