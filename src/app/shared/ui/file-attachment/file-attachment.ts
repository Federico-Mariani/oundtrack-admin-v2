import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideFileAudio, lucideImage, lucideX } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { FileAttachmentState } from './file-attachment-state';

@Component({
  selector: 'app-file-attachment',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmAttachmentImports, NgIcon],
  providers: [provideIcons({ lucideFileAudio, lucideImage, lucideX })],
  host: { class: 'block min-w-0' },
  templateUrl: './file-attachment.html',
})
export class FileAttachment {
  readonly name = input.required<string>();
  readonly description = input('');
  readonly icon = input('lucideFileAudio');
  readonly state = input<FileAttachmentState>(FileAttachmentState.Idle);
  readonly removable = input(true);
  readonly disabled = input(false);
  readonly removeLabel = input.required<string>();

  readonly removed = output();
}
