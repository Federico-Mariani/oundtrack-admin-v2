import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { form } from '@angular/forms/signals';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { LanguageService } from '@app/core/i18n/language/language.service';
import { DataTable } from '@shared/ui/data-table/data-table';
import { TextInput } from '@shared/ui/text-input/text-input';
import type { DataTableRemoteState } from '@shared/ui/data-table/data-table-remote-state';
import type { AvatarModel } from '../../../domain/models/avatar.model';
import type { AvatarsTableLabels } from './avatars-table-labels';
import { createAvatarsTableColumns } from './avatars-table.columns';

@Component({
  selector: 'app-avatars-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DataTable, TextInput, TranslocoDirective],
  template: ` <ng-container *transloco="let t; prefix: 'avatars.catalog'">
    <ng-template #controls
      ><app-text-input
        [formField]="searchForm.query"
        type="search"
        inputMode="search"
        [placeholder]="t('search')"
    /></ng-template>
    @if (columns().length) {
      <app-data-table
        [columns]="columns()"
        [data]="rows()"
        [remote]="remote()"
        [getRowId]="rowId"
        [caption]="t('title')"
        [loading]="loading()"
        [errorMessage]="errorMessage()"
        [showPagination]="false"
        [controls]="controls"
        (retry)="retry.emit()"
        (resetQuery)="search.set({ query: '' })"
      />
    }
  </ng-container>`,
})
export class AvatarsTable {
  private readonly language = inject(LanguageService);
  private readonly transloco = inject(TranslocoService);
  readonly avatars = input.required<ReadonlyArray<AvatarModel>>();
  readonly loading = input(false);
  readonly errorMessage = input<string | null>(null);
  readonly retry = output();
  readonly edit = output<string>();
  readonly copyId = output<string>();
  protected readonly search = signal({ query: '' });
  protected readonly searchForm = form(this.search);
  private readonly labels = toSignal(
    this.transloco.selectTranslateObject<AvatarsTableLabels>('table', {}, 'avatars'),
  );
  protected readonly columns = computed(() => {
    const labels = this.labels();
    return labels
      ? createAvatarsTableColumns(
          labels,
          this.language.activeLocale(),
          (id) => {
            this.edit.emit(id);
          },
          (id) => {
            this.copyId.emit(id);
          },
        )
      : [];
  });
  protected readonly rows = computed(() =>
    this.avatars()
      .filter((avatar) =>
        avatar.id.toLowerCase().includes(this.search().query.trim().toLowerCase()),
      )
      .sort((a, b) => b.createdAt - a.createdAt),
  );
  protected readonly remote = computed<DataTableRemoteState>(() => ({
    page: 1,
    limit: Math.max(1, this.rows().length),
    total: this.rows().length,
    search: this.search().query,
    filtered: !!this.search().query.trim(),
  }));
  protected readonly rowId = (row: AvatarModel): string => row.id;
}
