import type { GenreInfoResponseDto } from '@app/core/catalog/api/genre-info-response.dto';
import type { GenreInfoModel } from '@shared/types/catalog/genre-info.model';

export function toGenreInfo(dto: GenreInfoResponseDto): GenreInfoModel {
  return {
    id: dto.id,
    name: dto.name,
  };
}
