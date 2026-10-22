import type { HintSaveEvent } from '../workflows/hint-save-event.workflow';
import { createActionGroup, props } from '@ngrx/store';
import { createRequestActions } from '@shared/state/ngrx/create-request-actions';
import type { RequestError } from '@shared/state/request/request-error';
import type { HintModel } from '../../../domain/models/hint.model';
import type { HintOwner } from '../../../domain/values/hint-owner';
import type { SaveHintCommand } from '../../commands/save-hint.command';
import { HINTS_STATE_DEFINITION } from '../hints-state-definition';
import { HintsRequestOperation } from '../hints-request-operation';
export const HintsPanelEvents = createActionGroup({
  source: `${HINTS_STATE_DEFINITION.source} ${HintsRequestOperation.Session}` as const,
  events: {
    Opened: props<{ sessionId: string; owner: HintOwner }>(),
    Closed: props<{ sessionId: string }>(),
  },
});
export const HintsLoadActions = createRequestActions<
  { sessionId: string; requestId: string; ownerId: string },
  { sessionId: string; requestId: string; hints: ReadonlyArray<HintModel> },
  { sessionId: string; requestId: string; error: RequestError }
>(HINTS_STATE_DEFINITION.source, HintsRequestOperation.Load);
export const HintsSaveActions = createRequestActions<
  { sessionId: string; requestId: string; command: SaveHintCommand },
  { sessionId: string; requestId: string; hint: HintModel | null },
  { sessionId: string; requestId: string; error: RequestError }
>(HINTS_STATE_DEFINITION.source, HintsRequestOperation.Save);

export const HintsSaveProgressEvents = createActionGroup({
  source: `${HINTS_STATE_DEFINITION.source} ${HintsRequestOperation.Save} Progress` as const,
  events: { Changed: props<{ sessionId: string; requestId: string; event: HintSaveEvent }>() },
});
