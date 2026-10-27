import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideEllipsis, lucidePencil } from '@ng-icons/lucide';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { HlmDropdownMenu, HlmDropdownMenuItem } from '@spartan-ng/helm/dropdown-menu';

@Component({
  selector: 'app-avatar-actions-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton, HlmDropdownMenu, HlmDropdownMenuItem, NgIcon],
  providers: [provideIcons({ lucideEllipsis, lucidePencil, lucideCopy })],
  templateUrl: './avatar-actions-cell.html',
})
export class AvatarActionsCell {
  readonly editLabel = input.required<string>();
  readonly copyLabel = input.required<string>();
  readonly edit = output();
  readonly copyId = output();
}
