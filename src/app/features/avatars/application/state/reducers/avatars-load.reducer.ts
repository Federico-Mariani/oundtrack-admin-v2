import { type ActionCreator, on, type ReducerTypes } from '@ngrx/store';
import type { AvatarsState } from '../avatars.state';
import { AvatarsLoadActions } from '../actions/avatars-load.actions';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from '@shared/state/request/request-state.transitions';

export const avatarsLoadReducer: Array<ReducerTypes<AvatarsState, ReadonlyArray<ActionCreator>>> = [
  on(AvatarsLoadActions.requested, (state): AvatarsState => ({
    ...state,
    loadRequest: pendingRequest(),
  })),

  on(AvatarsLoadActions.succeeded, (state, { avatars }): AvatarsState => ({
    ...state,
    avatars,
    loadRequest: succeededRequest(),
  })),

  on(AvatarsLoadActions.failed, (state, { error }): AvatarsState => ({
    ...state,
    loadRequest: failedRequest(error),
  })),

  on(AvatarsLoadActions.reset, (state): AvatarsState => ({
    ...state,
    loadRequest: idleRequest(),
  })),
];
