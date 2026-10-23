import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  HintsIconsActions,
  HintsPanelEvents,
  HintsLoadActions,
  HintsSaveActions,
} from '../actions/hints.actions';
import type { HintOwner } from '../../../domain/values/hint-owner';
import type { SaveHintCommand } from '../../commands/save-hint.command';
@Injectable({ providedIn: 'root' })
export class HintsStoreActionsFacade {
  private readonly store = inject(Store);
  open(sessionId: string, owner: HintOwner): void {
    this.store.dispatch(HintsPanelEvents.opened({ sessionId, owner }));
  }
  close(sessionId: string): void {
    this.store.dispatch(HintsPanelEvents.closed({ sessionId }));
  }
  load(sessionId: string, ownerId: string): void {
    this.store.dispatch(
      HintsLoadActions.requested({ sessionId, ownerId, requestId: crypto.randomUUID() }),
    );
  }
  loadIcons(sessionId: string): void {
    this.store.dispatch(HintsIconsActions.requested({ sessionId, requestId: crypto.randomUUID() }));
  }
  save(sessionId: string, requestId: string, command: SaveHintCommand): void {
    this.store.dispatch(HintsSaveActions.requested({ sessionId, requestId, command }));
  }
  resetSave(): void {
    this.store.dispatch(HintsSaveActions.reset());
  }
}
