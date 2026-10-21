export const HintType = {
  Actor: 'actor',
  Year: 'year',
  Frame: 'frame',
  Quote: 'quote',
  Plot: 'plot',
} as const;
export type HintType = (typeof HintType)[keyof typeof HintType];
export const HINT_TYPES = Object.values(HintType);
export function isHintType(value: string): value is HintType {
  return HINT_TYPES.some((type) => type === value);
}
