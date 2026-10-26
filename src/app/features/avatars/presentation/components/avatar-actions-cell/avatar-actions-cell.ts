import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucidePencil, lucideCopy } from '@ng-icons/lucide';
import { IconButton } from '@shared/ui/icon-button/icon-button';
@Component({
  selector: 'app-avatar-actions-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton],
  providers: [provideIcons({ lucidePencil, lucideCopy })],
  template: `<div class="flex items-center gap-1">
    <app-icon-button
      icon="lucidePencil"
      variant="ghost"
      [ariaLabel]="editLabel()"
      (click)="edit.emit()"
    /><app-icon-button
      icon="lucideCopy"
      variant="ghost"
      [ariaLabel]="copyLabel()"
      (click)="copyId.emit()"
    />
  </div>`,
})
export class AvatarActionsCell {
  readonly editLabel = input.required<string>();
  readonly copyLabel = input.required<string>();
  readonly edit = output();
  readonly copyId = output();
}
