import { fromApiLocales } from '@app/core/http/api-locale.mapper';
import type { SoundtrackTrackResponseDto } from '@app/core/catalog/api/soundtrack-track-response.dto';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';

export function toSoundtrackTrack(dto: SoundtrackTrackResponseDto): SoundtrackTrackModel {
  return {
    id: dto.id,
    externalId: dto.externalId,
    path: dto.path,
    name: dto.name,
    artist: dto.artist,
    languages: fromApiLocales(dto.languages),
  };
}
