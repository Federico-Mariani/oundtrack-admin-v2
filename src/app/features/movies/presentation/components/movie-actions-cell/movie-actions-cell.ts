import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucideCopy } from '@ng-icons/lucide';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
  selector: 'app-movie-actions-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, IconButton, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsis, lucideCopy })],
  templateUrl: './movie-actions-cell.html',
})
export class MovieActionsCell {
  readonly label = input.required<string>();
  readonly copyIdLabel = input.required<string>();
  readonly copyExternalIdLabel = input.required<string>();
  readonly copyId = output();
  readonly copyExternalId = output();
}
