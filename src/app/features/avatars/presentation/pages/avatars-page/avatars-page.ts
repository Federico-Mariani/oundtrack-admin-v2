import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  ViewContainerRef,
} from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideUserRound, lucidePlus, lucideRefreshCw } from '@ng-icons/lucide';
import { NotificationService } from '@app/core/notifications/notification.service';
import { Button } from '@shared/ui/button/button';
import { ModalService } from '@shared/ui/modal/modal.service';
import { AvatarsFacade } from '../../../application/state/facades/avatars.facade';
import type { AvatarModel } from '../../../domain/models/avatar.model';
import { AvatarEditor } from '../../components/avatar-editor/avatar-editor';
import { AvatarsTable } from '../../components/avatars-table/avatars-table';
@Component({
  selector: 'app-avatars-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, NgIcon, Button, AvatarsTable],
  providers: [provideIcons({ lucideUserRound, lucidePlus, lucideRefreshCw })],
  templateUrl: './avatars-page.html',
})
export class AvatarsPage {
  private readonly facade = inject(AvatarsFacade);
  private readonly modals = inject(ModalService);
  private readonly container = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly clipboard = inject(Clipboard);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  private editorOpen = false;
  protected readonly avatars = this.facade.data.avatars;
  protected readonly loading = this.facade.requests.getAll.isLoading;
  protected readonly error = this.facade.requests.getAll.error;
  constructor() {
    this.reload();
  }
  protected reload(): void {
    this.facade.actions.getAll();
  }
  protected edit(id: string): void {
    const avatar = this.avatars().find((item) => item.id === id);
    if (avatar) this.manage(avatar);
  }
  protected manage(avatar?: AvatarModel): void {
    if (this.editorOpen) return;
    this.editorOpen = true;
    this.modals
      .open(
        AvatarEditor,
        { avatar },
        {
          viewContainerRef: this.container,
          disableClose: true,
          contentClass: 'w-[min(36rem,calc(100vw-2rem))] max-w-none p-6 sm:p-8',
        },
      )
      .closed$.subscribe((changed) => {
        this.editorOpen = false;
        if (changed && !this.destroyRef.destroyed) this.reload();
      });
  }
  protected copy(id: string): void {
    if (this.clipboard.copy(id))
      this.notifications.success(this.transloco.translate('avatars.catalog.copied'));
    else this.notifications.error(this.transloco.translate('avatars.catalog.copyFailed'));
  }
}
