import type { RequestState } from '@shared/state/request/request-state';
import type { RequestError } from '@shared/state/request/request-error';
import { idleRequest } from '@shared/state/request/request-state.transitions';
import type { HintModel } from '../../domain/models/hint.model';
import type { HintOwner } from '../../domain/values/hint-owner';
import type { SaveHintCommand } from '../commands/save-hint.command';
export interface HintsState {
  readonly sessionId: string | null;
  readonly owner: HintOwner | null;
  readonly hints: ReadonlyArray<HintModel>;
  readonly loaded: boolean;
  readonly loadId: string | null;
  readonly loadRequest: RequestState<RequestError>;
  readonly saveId: string | null;
  readonly command: SaveHintCommand | null;
  readonly saveRequest: RequestState<RequestError>;
}
export const initialHintsState: HintsState = {
  sessionId: null,
  owner: null,
  hints: [],
  loaded: false,
  loadId: null,
  loadRequest: idleRequest(),
  saveId: null,
  command: null,
  saveRequest: idleRequest(),
};
