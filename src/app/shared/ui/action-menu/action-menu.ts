import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { HlmDropdownMenu, HlmDropdownMenuItem } from '@spartan-ng/helm/dropdown-menu';
import type { ActionMenuItem } from './action-menu-item';
@Component({
  selector: 'app-action-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmDropdownMenu, HlmDropdownMenuItem],
  template: `<div hlmDropdownMenu class="min-w-48">
    @for (item of items(); track item.value) {
      <button
        type="button"
        hlmDropdownMenuItem
        [disabled]="item.disabled ?? false"
        [class.text-destructive]="item.destructive"
        (triggered)="selected.emit(item.value)"
      >
        {{ item.label }}
      </button>
    }
  </div>`,
})
export class ActionMenu {
  readonly items = input.required<ReadonlyArray<ActionMenuItem>>();
  readonly selected = output<string>();
}
