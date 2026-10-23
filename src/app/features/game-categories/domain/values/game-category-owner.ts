export const GameCategoryOwnerType = { Movie: 'movie', TvSeries: 'tv_series' } as const;
export interface GameCategoryOwner {
  readonly id: string;
  readonly type: (typeof GameCategoryOwnerType)[keyof typeof GameCategoryOwnerType];
}
