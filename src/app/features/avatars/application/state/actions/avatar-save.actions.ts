import { createActionGroup, props } from '@ngrx/store';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { AvatarModel } from '../../../domain/models/avatar.model';
import type { SaveAvatarCommand } from '../../commands/save-avatar.command';
import { AVATARS_STATE_DEFINITION } from '../avatars-state-definition';
import { AvatarsRequestOperation } from '../avatars-request-operation';
export const AvatarEditorEvents = createActionGroup({
  source: `${AVATARS_STATE_DEFINITION.source} ${AvatarsRequestOperation.Manage}` as const,
  events: {
    Opened: props<{ sessionId: string }>(),
    Closed: props<{ sessionId: string }>(),
    Progress: props<{ sessionId: string; requestId: string; progress: number }>(),
    Uploaded: props<{ sessionId: string; requestId: string; fileKey: string; key: string }>(),
  },
});
export const AvatarSaveActions = createRequestActions<
  { sessionId: string; requestId: string; command: SaveAvatarCommand },
  { sessionId: string; requestId: string; avatar: AvatarModel },
  { sessionId: string; requestId: string; error: RequestError }
>(AVATARS_STATE_DEFINITION.source, AvatarsRequestOperation.Save);
