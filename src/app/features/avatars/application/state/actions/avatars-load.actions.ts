import { createEmptyRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { AvatarModel } from '../../../domain/models/avatar.model';
import { AVATARS_STATE_DEFINITION } from '../avatars-state-definition';
import { AvatarsRequestOperation } from '../avatars-request-operation';
export const AvatarsLoadActions = createEmptyRequestActions<
  { avatars: ReadonlyArray<AvatarModel> },
  { error: RequestError }
>(AVATARS_STATE_DEFINITION.source, AvatarsRequestOperation.GetAll);
