import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import type { GenreModel } from '@shared/types/catalog/genre.model';
import type { GenreResponseDto } from '@app/core/catalog/api/genre-response.dto';
import { toGenreInfo } from '@app/core/catalog/mappers/genre-info.mapper';

export function toGenre(dto: GenreResponseDto): GenreModel {
  return {
    id: dto.id,
    info: mapApiLocalized(dto.info, toGenreInfo),
  };
}
