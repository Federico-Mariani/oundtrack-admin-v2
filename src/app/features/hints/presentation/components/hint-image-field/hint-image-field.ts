import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FileDropzone } from '@shared/ui/file-dropzone/file-dropzone';
import { FileAttachment } from '@shared/ui/file-attachment/file-attachment';
import { FileAttachmentState } from '@shared/ui/file-attachment/file-attachment-state';
import { MediaImage } from '@shared/ui/media-image/media-image';
import type { HintImageSelection } from '../../uploads/hint-image-selection';
@Component({
  selector: 'app-hint-image-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, FileDropzone, FileAttachment, MediaImage],
  templateUrl: './hint-image-field.html',
})
export class HintImageField {
  readonly selection = input.required<HintImageSelection>();
  readonly disabled = input(false);
  readonly submitted = input(false);
  readonly existingImage = input<string | null>(null);
  readonly required = input(true);
  protected readonly attachmentStates = FileAttachmentState;
  protected choose(file: File): void {
    if (!this.disabled()) void this.selection().choose(file);
  }
  protected remove(): void {
    if (!this.disabled()) this.selection().remove();
  }
}
