export interface MediaThumbnailCellOptions<TData> {
  readonly src: (data: TData) => string | null | undefined;
  readonly alt?: (data: TData) => string;
  readonly width?: number;
  readonly height?: number;
}
