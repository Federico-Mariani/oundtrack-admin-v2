import {
  type CellContext,
  type FlexRenderComponent,
  flexRenderComponent,
  type RowData,
} from '@tanstack/angular-table';

import type { DataTableFeatures } from '../ui/data-table/data-table-features';
import { MediaThumbnail } from '../ui/media-thumbnail/media-thumbnail';

export interface MediaThumbnailCellOptions<TData> {
  readonly src: (data: TData) => string | null | undefined;
  readonly alt?: (data: TData) => string;
  readonly width?: number;
  readonly height?: number;
}

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
