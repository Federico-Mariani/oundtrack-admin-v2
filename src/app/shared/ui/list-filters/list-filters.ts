import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TextInput } from '../text-input/text-input';
import { SelectField } from '../select-field/select-field';
import type { ListFilterField } from './list-filter-field';
@Component({
  selector: 'app-list-filters',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TextInput, SelectField],
  templateUrl: './list-filters.html',
})
export class ListFilters {
  readonly fields = input.required<readonly ListFilterField[]>();
  readonly compact = input(false);
}
