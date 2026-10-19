import type { TvSeriesSoundtrackTrackResponseDto } from './tv-series-soundtrack-track-response.dto';

export interface TvSeriesSoundtrackResponseDto {
  readonly id: string;
  readonly tracks: ReadonlyArray<TvSeriesSoundtrackTrackResponseDto>;
}
