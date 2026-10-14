import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import type { Field } from '@angular/forms/signals';
import { provideTranslocoScope, TranslocoDirective } from '@jsverse/transloco';
import { provideIcons } from '@ng-icons/core';
import { lucideFilterX, lucideSlidersHorizontal } from '@ng-icons/lucide';
import { TextInput } from '../text-input/text-input';
import { ListFilters } from '../list-filters/list-filters';
import type { ListFilterField } from '../list-filters/list-filter-field';
import { Dialog } from '../dialog/dialog';
import { Button } from '../button/button';
import { IconButton } from '../icon-button/icon-button';

@Component({
  selector: 'app-list-controls',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoDirective, TextInput, ListFilters, Dialog, Button, IconButton],
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
  readonly search = input.required<Field<string>>();
  readonly fields = input.required<readonly ListFilterField[]>();
  readonly activeCount = input(0);
  readonly resetFilters = output();

  protected readonly filtersOpen = signal(false);
}
