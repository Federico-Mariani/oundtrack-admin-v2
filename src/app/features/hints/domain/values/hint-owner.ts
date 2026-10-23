export const HintOwnerType = { Movie: 'movie', TvSeries: 'tv_series' } as const;
export type HintOwnerType = (typeof HintOwnerType)[keyof typeof HintOwnerType];
export interface HintOwner {
  readonly id: string;
  readonly type: HintOwnerType;
}
