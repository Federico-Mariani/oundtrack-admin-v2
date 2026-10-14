import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  HlmSelect,
  HlmSelectContent,
  HlmSelectGroup,
  HlmSelectItem,
  HlmSelectPortal,
  HlmSelectTrigger,
  HlmSelectValue,
} from '@spartan-ng/helm/select';
import type { SelectItem } from '@shared/interfaces/select-item';

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmSelect,
    HlmSelectTrigger,
    HlmSelectValue,
    HlmSelectContent,
    HlmSelectPortal,
    HlmSelectGroup,
    HlmSelectItem,
  ],
})
export class Select {
  private static nextId = 0;

  protected readonly triggerId = `app-select-${String(Select.nextId++)}`;
  readonly items = input.required<SelectItem[]>();
  readonly disabled = input(false);
  readonly invalid = input(false);
  readonly describedBy = input<string>();
  readonly blurred = output();
  readonly placeholder = input<string>('');
  readonly value = input<string>();
  readonly ariaLabel = input<string>();
  readonly valueChange = output<string>();

  protected readonly itemLabel = computed(() => {
    const items = this.items();
    return (value: unknown): string =>
      items.find((item) => item.value === value)?.label ?? (typeof value === 'string' ? value : '');
  });
  protected readonly displayPlaceholder = computed(
    () => this.items().find((item) => item.value === this.value())?.label ?? this.placeholder(),
  );

  protected onValueChange(value: unknown): void {
    if (typeof value === 'string') {
      this.valueChange.emit(value);
    }
  }
}
