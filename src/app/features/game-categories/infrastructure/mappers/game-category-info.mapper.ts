import type { GameCategoryInfoResponseDto } from '../api/game-category-info-response.dto';
import type { GameCategoryInfoModel } from '../../domain/models/game-category-info.model';

export function toGameCategoryInfo(dto: GameCategoryInfoResponseDto): GameCategoryInfoModel {
  return {
    id: dto.id,
    name: dto.name,
  };
}
