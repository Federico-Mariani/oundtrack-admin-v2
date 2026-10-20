import type { SoundtrackResponseDto } from '@app/core/catalog/api/soundtrack-response.dto';
import type { SoundtrackModel } from '@shared/types/catalog/soundtrack.model';
import { toSoundtrackTrack } from '@app/core/catalog/mappers/soundtrack-track.mapper';

export function toSoundtrack(dto: SoundtrackResponseDto): SoundtrackModel {
  return {
    id: dto.id,
    tracks: dto.tracks.map((track) => toSoundtrackTrack(track)),
  };
}
