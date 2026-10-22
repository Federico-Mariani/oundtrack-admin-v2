import type { HintType } from '../../domain/values/hint-type';
export interface HintTypeIconResponseDto {
  readonly type: HintType;
  readonly icon: string | null;
}
