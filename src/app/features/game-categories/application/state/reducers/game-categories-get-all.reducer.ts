import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import type { GameCategoriesState } from '../game-categories.state';
import { GameCategoriesGetAllActions } from '../actions/game-categories-get-all.actions';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

export const gameCategoriesGetAllReducer: Array<
  ReducerTypes<GameCategoriesState, ReadonlyArray<ActionCreator>>
> = [
  on(GameCategoriesGetAllActions.requested, (state): GameCategoriesState => ({
    ...state,
    loadRequest: pendingRequest(),
  })),

  on(GameCategoriesGetAllActions.succeeded, (state, { categories }): GameCategoriesState => ({
    ...state,
    categories,
    loaded: true,
    loadRequest: succeededRequest(),
  })),

  on(GameCategoriesGetAllActions.failed, (state, { error }): GameCategoriesState => ({
    ...state,
    loadRequest: failedRequest(error),
  })),

  on(GameCategoriesGetAllActions.reset, (state): GameCategoriesState => ({
    ...state,
    loadRequest: idleRequest(),
  })),
];
