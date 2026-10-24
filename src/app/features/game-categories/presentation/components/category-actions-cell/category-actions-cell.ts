import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucidePencil } from '@ng-icons/lucide';
import { IconButton } from '@shared/ui/icon-button/icon-button';
@Component({
  selector: 'app-category-actions-cell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IconButton],
  providers: [provideIcons({ lucidePencil })],
  template: `<app-icon-button
    icon="lucidePencil"
    variant="ghost"
    [ariaLabel]="label()"
    [title]="label()"
    (click)="manage.emit()"
  />`,
})
export class CategoryActionsCell {
  readonly label = input.required<string>();
  readonly manage = output();
}
