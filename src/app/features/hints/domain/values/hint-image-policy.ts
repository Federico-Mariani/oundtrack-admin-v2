import { HintType } from './hint-type';
export const HINT_IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const HintImageContentType = { Jpeg: 'image/jpeg', Png: 'image/png' } as const;
export type HintImageContentType = (typeof HintImageContentType)[keyof typeof HintImageContentType];
export function isImageHint(type: HintType | undefined): boolean {
  return type === HintType.Actor || type === HintType.Frame;
}
export function isHintImageContentType(value: string): value is HintImageContentType {
  return value === HintImageContentType.Jpeg || value === HintImageContentType.Png;
}
