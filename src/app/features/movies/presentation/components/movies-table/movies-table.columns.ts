import { type ColumnDef, createColumnHelper, flexRenderComponent } from '@tanstack/angular-table';
import type { DataTableFeatures } from '@shared/ui/data-table/data-table-features';
import type { Id } from '@shared/types/id';
import type { MovieTableRowModel } from '../../models/movie-table-row.model';
import { MovieTitleCell } from '../movie-title-cell/movie-title-cell';
import { MovieActionsCell } from '../movie-actions-cell/movie-actions-cell';
import type { MoviesTableLabels } from './movies-table-labels';

const columnHelper = createColumnHelper<DataTableFeatures, MovieTableRowModel>();

export function createMoviesTableColumns(
  labels: MoviesTableLabels,
  copyId: (id: Id) => void,
  copyExternalId: (id: number) => void,
): ColumnDef<DataTableFeatures, MovieTableRowModel>[] {
  return columnHelper.columns([
    columnHelper.accessor('title', {
      header: labels.title,
      size: 360,
      minSize: 220,
      enableHiding: false,
      sortFn: 'text',
      cell: (context) =>
        flexRenderComponent(MovieTitleCell, {
          inputs: { title: context.row.original.title, posterUrl: context.row.original.posterUrl },
        }),
    }),
    columnHelper.accessor('genres', {
      header: labels.genres,
      size: 240,
      sortFn: 'text',
      cell: (context) => context.getValue() || '—',
    }),
    columnHelper.accessor('releaseDate', {
      header: labels.releaseDate,
      size: 170,
      sortFn: 'basic',
      sortUndefined: 'last',
      enableGlobalFilter: false,
      cell: (context) => context.row.original.releaseDateLabel,
    }),
    columnHelper.accessor('externalMovieId', {
      header: labels.externalId,
      size: 140,
      sortFn: 'basic',
    }),
    columnHelper.display({
      id: 'actions',
      header: labels.actions,
      size: 100,
      minSize: 100,
      maxSize: 100,
      enableHiding: false,
      enableResizing: false,
      enableSorting: false,
      enableGlobalFilter: false,
      cell: (context) =>
        flexRenderComponent(MovieActionsCell, {
          inputs: {
            label: `${labels.actions}: ${context.row.original.title}`,
            copyIdLabel: labels.copyId,
            copyExternalIdLabel: labels.copyExternalId,
          },
          outputs: {
            copyId: () => {
              copyId(context.row.original.id);
            },
            copyExternalId: () => {
              copyExternalId(context.row.original.externalMovieId);
            },
          },
        }),
    }),
  ]);
}
