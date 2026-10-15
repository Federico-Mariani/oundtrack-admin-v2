import type { MovieSoundtrackTrackResponseDto } from './movie-soundtrack-track-response.dto';

export interface MovieSoundtrackResponseDto {
  readonly id: string;
  readonly tracks: ReadonlyArray<MovieSoundtrackTrackResponseDto>;
}
