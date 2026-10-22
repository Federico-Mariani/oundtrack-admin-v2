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
  template: `
    <div
      hlmAttachment
      class="w-full flex-nowrap gap-3 rounded-lg p-3 shadow-none"
      [state]="state()"
    >
      <div hlmAttachmentMedia class="size-10 rounded-md">
        <ng-icon [name]="icon()" aria-hidden="true" />
      </div>
      <div hlmAttachmentContent>
        <span hlmAttachmentTitle [title]="name()">{{ name() }}</span>
        <span hlmAttachmentDescription>{{ description() }}</span>
      </div>
      @if (removable()) {
        <div hlmAttachmentActions>
          <button
            hlmAttachmentAction
            size="icon-sm"
            [attr.aria-label]="removeLabel() + ': ' + name()"
            [disabled]="disabled()"
            (click)="removed.emit()"
          >
            <ng-icon name="lucideX" aria-hidden="true" />
          </button>
        </div>
      }
    </div>
  `,
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
