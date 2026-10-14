import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { Button } from '../button/button';
import { Select } from '../select/select';
import { HlmInput } from '@spartan-ng/helm/input';
import type { ListFilterField } from './list-filter-field';
import { invalidListFilter } from './list-filter-validation';

@Component({
  selector: 'app-list-filters',
  templateUrl: './list-filters.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, Button, Select, HlmInput],
  providers: [
    provideTranslocoScope({
      scope: 'list-filters',
      alias: 'listFilters',
      loader: {
        en: () => import('./i18n/en.json').then((module) => module.default),
        it: () => import('./i18n/it.json').then((module) => module.default),
      },
    }),
  ],
})
export class ListFilters {
  private static nextId = 0;
  readonly fields = input.required<readonly ListFilterField[]>();
  readonly values = input.required<Readonly<Record<string, string>>>();
  readonly applyFilters = output<Readonly<Record<string, string>>>();
  readonly resetFilters = output();
  protected readonly draft = signal<Readonly<Record<string, string>>>({});
  protected readonly valid = computed(() =>
    this.fields().every((field) => !invalidListFilter(field, this.draft())),
  );
  protected readonly prefix = `list-filters-${String(ListFilters.nextId++)}`;
  constructor() {
    effect(() => {
      this.draft.set({ ...this.values() });
    });
  }
  protected change(key: string, value: string): void {
    this.draft.update((draft) => ({ ...draft, [key]: value }));
  }
  protected invalid(field: ListFilterField): boolean {
    return invalidListFilter(field, this.draft());
  }
  protected reset(): void {
    this.draft.set({ ...this.values() });
    this.resetFilters.emit();
  }
  protected submit(event: Event): void {
    event.preventDefault();
    if (this.valid()) {
      this.applyFilters.emit(this.draft());
    }
  }
}
