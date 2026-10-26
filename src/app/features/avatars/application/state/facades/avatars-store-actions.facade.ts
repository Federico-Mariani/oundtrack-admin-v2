import { AvatarEditorEvents, AvatarSaveActions } from '../actions/avatar-save.actions';
import { AvatarsLoadActions } from '../actions/avatars-load.actions';
import type { SaveAvatarCommand } from '../../commands/save-avatar.command';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
@Injectable({ providedIn: 'root' })
export class AvatarsStoreActionsFacade {
  private readonly store = inject(Store);
  openEditor(sessionId: string): void {
    this.store.dispatch(AvatarEditorEvents.opened({ sessionId }));
  }
  closeEditor(sessionId: string): void {
    this.store.dispatch(AvatarEditorEvents.closed({ sessionId }));
  }
  getAll(): void {
    this.store.dispatch(AvatarsLoadActions.requested());
  }
  save(sessionId: string, requestId: string, command: SaveAvatarCommand): void {
    this.store.dispatch(AvatarSaveActions.requested({ sessionId, requestId, command }));
  }
}
