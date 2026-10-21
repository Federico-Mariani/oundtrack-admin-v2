import type { SoundtrackTrackResponseDto } from '@app/core/catalog/api/soundtrack-track-response.dto';

export interface SoundtrackResponseDto {
  readonly id: string;
  readonly tracks: ReadonlyArray<SoundtrackTrackResponseDto>;
}
