export const SoundtrackOwnerType = { Movie: 'movie', TvSeries: 'tv_series' } as const;
export type SoundtrackOwnerType = (typeof SoundtrackOwnerType)[keyof typeof SoundtrackOwnerType];
export interface SoundtrackOwner {
  readonly type: SoundtrackOwnerType;
  readonly id: string;
}
