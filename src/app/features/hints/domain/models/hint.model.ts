import type { HintType } from '../values/hint-type';
import type { HintInfoModel } from './hint-info.model';
export interface HintModel {
  readonly id: string;
  readonly type: HintType;
  readonly icon: string | null;
  readonly cost: number;
  readonly info: ReadonlyArray<HintInfoModel>;
  readonly createdAt: number;
  readonly updatedAt: number;
}
