import { CategoryActionsCell } from '../category-actions-cell/category-actions-cell';
import { type ColumnDef, createColumnHelper, flexRenderComponent } from '@tanstack/angular-table';
import type { DataTableFeatures } from '@shared/ui/data-table/data-table-features';
import type { GameCategoryTableRowModel } from '../../models/game-category-table-row.model';
import { GameCategoryNameCell } from '../game-category-name-cell/game-category-name-cell';
import { GameCategoryLanguagesCell } from '../game-category-languages-cell/game-category-languages-cell';
import type { GameCategoriesTableLabels } from './game-categories-table-labels';

const columnHelper = createColumnHelper<DataTableFeatures, GameCategoryTableRowModel>();

export function createGameCategoriesTableColumns(
  labels: GameCategoriesTableLabels,
  manage: (id: string) => void,
): Array<ColumnDef<DataTableFeatures, GameCategoryTableRowModel>> {
  return columnHelper.columns([
    columnHelper.accessor('name', {
      header: labels.name,
      size: 440,
      minSize: 240,
      maxSize: 10000,
      enableHiding: false,
      cell: (context) =>
        flexRenderComponent(GameCategoryNameCell, {
          inputs: {
            name: context.row.original.name,
            imageUrl: context.row.original.imageUrl,
          },
        }),
    }),
    columnHelper.accessor((row) => row.languages.join(', '), {
      id: 'languages',
      header: labels.languages,
      size: 180,
      minSize: 120,
      cell: (context) =>
        flexRenderComponent(GameCategoryLanguagesCell, {
          inputs: {
            languages: context.row.original.languages,
          },
        }),
    }),
    columnHelper.accessor('id', {
      header: labels.id,
      size: 260,
      minSize: 180,
      cell: (context) => context.getValue(),
    }),
    columnHelper.display({
      id: 'actions',
      header: labels.actions,
      size: 100,
      minSize: 100,
      maxSize: 100,
      enableHiding: false,
      enableResizing: false,
      cell: (context) =>
        flexRenderComponent(CategoryActionsCell, {
          inputs: { label: labels.manage },
          outputs: {
            manage: () => {
              manage(context.row.original.id);
            },
          },
        }),
    }),
  ]);
}
