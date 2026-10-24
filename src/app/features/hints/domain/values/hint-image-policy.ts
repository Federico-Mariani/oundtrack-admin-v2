import { HintType } from './hint-type';
export function isImageHint(type: HintType | undefined): boolean {
  return type === HintType.Actor || type === HintType.Frame;
}
