import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import type { GameCategoryResponseDto } from '@app/core/catalog/api/game-category-response.dto';
import type { GameCategoryModel } from '@shared/types/catalog/game-category.model';
import { toGameCategoryInfo } from '@app/core/catalog/mappers/game-category-info.mapper';

export function toGameCategory(dto: GameCategoryResponseDto): GameCategoryModel {
  return {
    id: dto.id,
    image: dto.image,
    info: mapApiLocalized(dto.info, toGameCategoryInfo),
  };
}
