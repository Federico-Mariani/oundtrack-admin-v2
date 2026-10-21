import { HintType } from './hint-type';
export const HINT_COSTS: Readonly<Record<HintType, number>> = {
  [HintType.Actor]: 200,
  [HintType.Plot]: 300,
  [HintType.Frame]: 300,
  [HintType.Quote]: 200,
  [HintType.Year]: 100,
};
