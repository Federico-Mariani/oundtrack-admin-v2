import type { GameCategoryInfoModel } from '@shared/types/catalog/game-category-info.model';
import type { GameCategoryInfoResponseDto } from '@app/core/catalog/api/game-category-info-response.dto';

export function toGameCategoryInfo(dto: GameCategoryInfoResponseDto): GameCategoryInfoModel {
  return {
    id: dto.id,
    name: dto.name,
  };
}
