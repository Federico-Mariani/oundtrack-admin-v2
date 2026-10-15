import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  inject,
  ViewContainerRef,
} from '@angular/core';
import type { Field } from '@angular/forms/signals';
import { TranslocoDirective, provideTranslocoScope } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideSlidersHorizontal, lucideFilterX } from '@ng-icons/lucide';
import { TextInput } from '../text-input/text-input';
import { ListFilters } from '../list-filters/list-filters';
import type { ListFilterField } from '../list-filters/list-filter-field';
import { ModalService } from '../modal/modal.service';
import { ListFiltersModal } from './list-filters-modal/list-filters-modal';
import type { BrnDialogRef } from '@spartan-ng/brain/dialog';
import { IconButton } from '../icon-button/icon-button';
@Component({
  selector: 'app-list-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, TextInput, ListFilters, IconButton],
  providers: [provideIcons({ lucideSlidersHorizontal, lucideFilterX })],
  viewProviders: [
    provideTranslocoScope({
      scope: 'list-controls',
      alias: 'listControls',
      loader: {
        en: () => import('./i18n/en.json').then((m) => m.default),
        it: () => import('./i18n/it.json').then((m) => m.default),
      },
    }),
  ],
  templateUrl: './list-controls.html',
})
export class ListControls {
  private readonly modals = inject(ModalService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  readonly search = input.required<Field<string>>();
  readonly fields = input.required<ReadonlyArray<ListFilterField>>();
  readonly activeCount = input(0);
  readonly resetFilters = output();
  private filtersRef: BrnDialogRef<void> | undefined;

  protected openFilters(): void {
    if (this.filtersRef) {
      return;
    }
    const ref = this.modals.open(
      ListFiltersModal,
      {
        fields: this.fields,
        reset: () => {
          this.resetFilters.emit();
        },
      },
      { viewContainerRef: this.viewContainerRef },
    );
    this.filtersRef = ref;
    ref.closed$.subscribe(() => {
      this.filtersRef = undefined;
    });
  }
}
