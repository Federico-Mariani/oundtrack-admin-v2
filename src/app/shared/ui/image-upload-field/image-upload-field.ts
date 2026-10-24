import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { FileDropzone } from '@shared/ui/file-dropzone/file-dropzone';
import { FileAttachment } from '@shared/ui/file-attachment/file-attachment';
import { FileAttachmentState } from '@shared/ui/file-attachment/file-attachment-state';
import { MediaImage } from '@shared/ui/media-image/media-image';
import type { ImageSelectionControl } from './image-selection-control';
@Component({
  selector: 'app-image-upload-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, FileDropzone, FileAttachment, MediaImage],
  templateUrl: './image-upload-field.html',
})
export class ImageUploadField {
  readonly translationPrefix = input.required<string>();
  readonly previewClass = input('aspect-video w-full rounded-lg');
  private static nextId = 0;
  protected readonly errorId = `image-upload-errors-${String(ImageUploadField.nextId++)}`;
  readonly selection = input.required<ImageSelectionControl>();
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
