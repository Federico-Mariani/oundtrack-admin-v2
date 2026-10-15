import { MovieLanguagesCell } from '../movie-languages-cell/movie-languages-cell';
import { type ColumnDef, createColumnHelper, flexRenderComponent } from '@tanstack/angular-table';
import type { DataTableFeatures } from '@shared/ui/data-table/data-table-features';
import type { Id } from '@shared/types/id';
import type { MovieTableRowModel } from '../../models/movie-table-row.model';
import { MovieGenresCell } from '../movie-genres-cell/movie-genres-cell';
import { MovieTitleCell } from '../movie-title-cell/movie-title-cell';
import { MovieActionsCell } from '../movie-actions-cell/movie-actions-cell';
import type { MoviesTableLabels } from './movies-table-labels';

const columnHelper = createColumnHelper<DataTableFeatures, MovieTableRowModel>();

export function createMoviesTableColumns(
  labels: MoviesTableLabels,
  copyId: (id: Id) => void,
  copyExternalId: (id: number) => void,
  viewDetail: (id: Id) => void,
): Array<ColumnDef<DataTableFeatures, MovieTableRowModel>> {
  return columnHelper.columns([
    columnHelper.accessor('title', {
      header: labels.title,
      size: 440,
      minSize: 260,
      maxSize: 10000,
      enableHiding: false,
      cell: (context) =>
        flexRenderComponent(MovieTitleCell, {
          inputs: {
            title: context.row.original.title,
            posterUrl: context.row.original.posterUrl,
            releaseDate: context.row.original.releaseDateLabel,
            releaseDateDescription: labels.releaseDate,
          },
        }),
    }),
    columnHelper.accessor((row) => row.genres.join(', '), {
      id: 'genres',
      header: labels.genres,
      size: 280,
      minSize: 180,
      cell: (context) =>
        flexRenderComponent(MovieGenresCell, { inputs: { genres: context.row.original.genres } }),
    }),
    columnHelper.accessor((row) => row.languages.join(', '), {
      id: 'languages',
      header: labels.languages,
      size: 160,
      minSize: 120,
      cell: (context) =>
        flexRenderComponent(MovieLanguagesCell, {
          inputs: { languages: context.row.original.languages },
        }),
    }),
    columnHelper.accessor('releaseDate', {
      header: labels.releaseDate,
      enableHiding: false,
      size: 170,
      cell: (context) => context.row.original.releaseDateLabel,
    }),
    columnHelper.accessor('externalMovieId', {
      header: labels.externalId,
      size: 160,
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
        flexRenderComponent(MovieActionsCell, {
          inputs: {
            label: `${labels.actions}: ${context.row.original.title}`,
            copyIdLabel: labels.copyId,
            viewDetailLabel: labels.viewDetail,
            copyExternalIdLabel: labels.copyExternalId,
          },
          outputs: {
            viewDetail: () => {
              viewDetail(context.row.original.id);
            },
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
