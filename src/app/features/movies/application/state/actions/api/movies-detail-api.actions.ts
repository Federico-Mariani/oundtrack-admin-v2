import { MoviesRequestOperation } from '../../movies-request-operation';
import { MOVIES_STATE_DEFINITION } from '../../movies-state-definition';
import { createActionGroup, props } from '@ngrx/store';
import type { Id } from '@shared/types/id';
import type { RequestError } from '@shared/state/request/request-error';
import type { MovieDetailModel } from '../../../../domain/models/movie-detail.model';

export const MoviesDetailApiActions = createActionGroup({
  source: `${MOVIES_STATE_DEFINITION.source} ${MoviesRequestOperation.GetById} API` as const,
  events: {
    Succeeded: props<{ id: Id; movie: MovieDetailModel }>(),
    Failed: props<{ id: Id; error: RequestError }>(),
  },
});
