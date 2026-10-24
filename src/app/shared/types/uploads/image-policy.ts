export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const ImageContentType = { Jpeg: 'image/jpeg', Png: 'image/png' } as const;
export type ImageContentType = (typeof ImageContentType)[keyof typeof ImageContentType];
export function isImageContentType(value: string): value is ImageContentType {
  return value === ImageContentType.Jpeg || value === ImageContentType.Png;
}
