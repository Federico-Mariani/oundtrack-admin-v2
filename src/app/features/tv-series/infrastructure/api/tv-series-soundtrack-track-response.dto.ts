export interface TvSeriesSoundtrackTrackResponseDto {
  readonly id: string;
  readonly externalId: string;
  readonly path: string | null;
  readonly name: string;
  readonly artist: string;
  readonly languages: Array<string>;
}
