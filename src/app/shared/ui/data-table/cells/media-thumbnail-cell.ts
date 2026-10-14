import {
  type CellContext,
  type FlexRenderComponent,
  flexRenderComponent,
  type RowData,
} from '@tanstack/angular-table';

import type { DataTableFeatures } from '../data-table-features';
import { MediaThumbnail } from '../../media-thumbnail/media-thumbnail';

import type { MediaThumbnailCellOptions } from './media-thumbnail-cell-options';

export function mediaThumbnailCell<TData extends RowData>(
  options: MediaThumbnailCellOptions<TData>,
): (context: CellContext<DataTableFeatures, TData>) => FlexRenderComponent<MediaThumbnail> {
  return (context) =>
    flexRenderComponent(MediaThumbnail, {
      inputs: {
        src: options.src(context.row.original),
        alt: options.alt?.(context.row.original) ?? '',
        width: options.width ?? 48,
        height: options.height ?? 72,
      },
    });
}
