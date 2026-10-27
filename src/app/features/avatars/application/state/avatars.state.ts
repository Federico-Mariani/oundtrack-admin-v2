import type { AvatarModel } from '../../domain/models/avatar.model';
import type { RequestState } from '@shared/state/request/request-state';
import type { RequestError } from '@shared/state/request/request-error';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import { AvatarSavePhase } from '../workflows/avatar-save.phase';
export interface AvatarsState {
  readonly avatars: ReadonlyArray<AvatarModel>;
  readonly loadRequest: RequestState<RequestError>;
  readonly saveRequest: RequestState<RequestError>;
  readonly sessionId: string | null;
  readonly requestId: string | null;
  readonly uploadedFile: string | null;
  readonly uploadKey: string | null;
  readonly progress: number | null;
  readonly phase: AvatarSavePhase;
}
export const initialAvatarsState: AvatarsState = {
  avatars: [],
  loadRequest: idleRequest(),
  saveRequest: idleRequest(),
  sessionId: null,
  requestId: null,
  uploadedFile: null,
  uploadKey: null,
  progress: null,
  phase: AvatarSavePhase.Idle,
};
