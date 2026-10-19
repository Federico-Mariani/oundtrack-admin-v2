import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideEllipsis, lucideEye } from '@ng-icons/lucide';
import { IconButton } from '@shared/ui/icon-button/icon-button';
import { HlmDropdownMenuImports } from '@spartan-ng/helm/dropdown-menu';

@Component({
  selector: 'app-tv-series-actions-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon, IconButton, HlmDropdownMenuImports],
  providers: [provideIcons({ lucideEllipsis, lucideCopy, lucideEye })],
  templateUrl: './tv-series-actions-cell.html',
})
export class TvSeriesActionsCell {
  readonly label = input.required<string>();
  readonly viewDetailLabel = input.required<string>();
  readonly viewDetail = output();
  readonly copyIdLabel = input.required<string>();
  readonly copyExternalIdLabel = input.required<string>();
  readonly copyId = output();
  readonly copyExternalId = output();
}
