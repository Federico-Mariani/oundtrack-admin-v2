import { type ColumnDef, createColumnHelper, flexRenderComponent } from '@tanstack/angular-table';
import type { DataTableFeatures } from '@shared/ui/data-table/data-table-features';
import type { Id } from '@shared/types/id';
import type { TvSeriesTableLabels } from './tv-series-table-labels';
import type { TvSeriesTableRowModel } from '../../models/tv-series-table-row.model';
import { TvSeriesActionsCell } from '../tv-series-actions-cell/tv-series-actions-cell';
import { TvSeriesLanguagesCell } from '../tv-series-languages-cell/tv-series-languages-cell';
import { TvSeriesTitleCell } from '../tv-series-title-cell/tv-series-title-cell';
import { TvSeriesGenresCell } from '../tv-series-genres-cell/tv-series-genres-cell';

const columnHelper = createColumnHelper<DataTableFeatures, TvSeriesTableRowModel>();

export function createTvSeriesTableColumns(
  labels: TvSeriesTableLabels,
  copyId: (id: Id) => void,
  copyExternalId: (id: number) => void,
  viewDetail: (id: Id) => void,
): Array<ColumnDef<DataTableFeatures, TvSeriesTableRowModel>> {
  return columnHelper.columns([
    columnHelper.accessor('title', {
      header: labels.title,
      size: 440,
      minSize: 260,
      maxSize: 10000,
      enableHiding: false,
      cell: (context) =>
        flexRenderComponent(TvSeriesTitleCell, {
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
        flexRenderComponent(TvSeriesGenresCell, {
          inputs: { genres: context.row.original.genres },
        }),
    }),
    columnHelper.accessor((row) => row.languages.join(', '), {
      id: 'languages',
      header: labels.languages,
      size: 160,
      minSize: 120,
      cell: (context) =>
        flexRenderComponent(TvSeriesLanguagesCell, {
          inputs: { languages: context.row.original.languages },
        }),
    }),
    columnHelper.accessor('releaseDate', {
      header: labels.releaseDate,
      enableHiding: false,
      size: 170,
      cell: (context) => context.row.original.releaseDateLabel,
    }),
    columnHelper.accessor('externalTvSeriesId', {
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
        flexRenderComponent(TvSeriesActionsCell, {
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
              copyExternalId(context.row.original.externalTvSeriesId);
            },
          },
        }),
    }),
  ]);
}
