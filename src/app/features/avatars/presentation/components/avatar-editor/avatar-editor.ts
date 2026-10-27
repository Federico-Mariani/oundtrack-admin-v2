import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { BrnDialogRef, injectBrnDialogContext } from '@spartan-ng/brain/dialog';
import { TranslocoDirective, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';
import { AvatarsFacade } from '../../../application/state/facades/avatars.facade';
import { avatarsTranslationsLoader } from '../../i18n/avatars-translations.loader';
import { ImageSelection } from '@app/core/uploads/image-selection';
import { NotificationService } from '@app/core/notifications/notification.service';
import { ModalFrame } from '@shared/ui/modal/modal-frame';
import { Button } from '@shared/ui/button/button';
import { ImageUploadField } from '@shared/ui/image-upload-field/image-upload-field';
import { UploadProgress } from '@shared/ui/upload-progress/upload-progress';
import type { ModalContent } from '@shared/ui/modal/modal-content';
import type { AvatarEditorParams } from './avatar-editor-params';
@Component({
  selector: 'app-avatar-editor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, ModalFrame, Button, ImageUploadField, UploadProgress],
  providers: [
    ImageSelection,
    provideTranslocoScope({ scope: 'avatars', loader: avatarsTranslationsLoader }),
  ],
  templateUrl: './avatar-editor.html',
})
export class AvatarEditor implements ModalContent<AvatarEditorParams, boolean> {
  readonly params = injectBrnDialogContext<{ params: AvatarEditorParams }>().params;
  readonly ref = inject<BrnDialogRef<boolean>>(BrnDialogRef);
  private readonly facade = inject(AvatarsFacade);
  private readonly notifications = inject(NotificationService);
  private readonly transloco = inject(TranslocoService);
  private readonly sessionId = crypto.randomUUID();
  private readonly requestId = signal<string | null>(null);
  protected readonly selection = inject(ImageSelection);
  protected readonly submitted = signal(false);
  protected readonly busy = this.facade.requests.save.isLoading;
  protected readonly error = this.facade.requests.save.error;
  protected readonly phase = this.facade.data.phase;
  protected readonly progress = this.facade.data.progress;
  constructor() {
    this.facade.actions.openEditor(this.sessionId);
    inject(DestroyRef).onDestroy(() => {
      this.facade.actions.closeEditor(this.sessionId);
    });
    effect(() => {
      if (!this.requestId() || this.facade.data.requestId() !== this.requestId()) return;
      if (this.facade.requests.save.isSuccess())
        untracked(() => {
          this.notifications.success(this.transloco.translate('avatars.editor.success'));
          this.ref.close(true);
        });
      else if (this.error())
        untracked(() => {
          this.notifications.error(this.transloco.translate('avatars.editor.failed'));
        });
    });
  }
  protected submit(event: Event): void {
    event.preventDefault();
    this.submitted.set(true);
    const fileKey = this.selection.fileKey();
    if (this.busy() || this.selection.checking() || !fileKey) return;
    const requestId = crypto.randomUUID();
    this.requestId.set(requestId);
    this.facade.actions.save(this.sessionId, requestId, {
      avatarId: this.params.avatar?.id,
      fileKey,
    });
  }
}
