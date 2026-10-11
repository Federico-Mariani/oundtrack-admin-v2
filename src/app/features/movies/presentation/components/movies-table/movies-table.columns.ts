import { createColumnHelper } from '@tanstack/angular-table';

import type { DataTableFeatures } from '@shared/ui/data-table/data-table-features';
import type { MovieTableRowModel } from '../../models/movie-table-row.model';

const columnHelper = createColumnHelper<DataTableFeatures, MovieTableRowModel>();

export const moviesTableColumns = columnHelper.columns([
  columnHelper.accessor('title', {
    header: 'Titolo',
  }),

  columnHelper.accessor('genres', {
    header: 'Generi',
  }),

  columnHelper.accessor('releaseDate', {
    header: 'Data di uscita',
  }),

  columnHelper.accessor('externalMovieId', {
    header: 'External ID',
  }),
]);
