import { type ColumnDef, createColumnHelper, flexRenderComponent } from '@tanstack/angular-table';
import type { DataTableFeatures } from '@shared/ui/data-table/data-table-features';
import type { AvatarModel } from '../../../domain/models/avatar.model';
import type { AvatarsTableLabels } from './avatars-table-labels';
import { AvatarImageCell } from '../avatar-image-cell/avatar-image-cell';
import { AvatarActionsCell } from '../avatar-actions-cell/avatar-actions-cell';

const helper = createColumnHelper<DataTableFeatures, AvatarModel>();

export function createAvatarsTableColumns(
  labels: AvatarsTableLabels,
  locale: string,
  edit: (id: string) => void,
  copy: (id: string) => void,
): Array<ColumnDef<DataTableFeatures, AvatarModel>> {
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' });
  return helper.columns([
    helper.accessor('path', {
      header: labels.image,
      size: 130,
      minSize: 100,
      enableHiding: false,
      cell: (context) =>
        flexRenderComponent(AvatarImageCell, {
          inputs: { path: context.getValue(), label: labels.image },
        }),
    }),
    helper.accessor('id', {
      header: labels.id,
      size: 340,
      minSize: 220,
      cell: (context) => context.getValue(),
    }),
    helper.accessor('createdAt', {
      header: labels.createdAt,
      size: 210,
      minSize: 180,
      cell: (context) => date.format(context.getValue()),
    }),
    helper.accessor('updatedAt', {
      header: labels.updatedAt,
      size: 210,
      minSize: 180,
      cell: (context) => date.format(context.getValue()),
    }),
    helper.display({
      id: 'actions',
      header: labels.actions,
      size: 100,
      minSize: 100,
      maxSize: 100,
      enableHiding: false,
      enableResizing: false,
      cell: (context) =>
        flexRenderComponent(AvatarActionsCell, {
          inputs: { editLabel: labels.edit, copyLabel: labels.copy },
          outputs: {
            edit: () => {
              edit(context.row.original.id);
            },
            copyId: () => {
              copy(context.row.original.id);
            },
          },
        }),
    }),
  ]);
}
