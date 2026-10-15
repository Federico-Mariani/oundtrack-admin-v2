import { mapApiLocalized } from '@app/core/http/api-localized.mapper';
import type { GameCategoryModel } from '../../domain/models/game-category.model';
import type { GameCategoryResponseDto } from '../api/game-category-response.dto';
import { toGameCategoryInfo } from './game-category-info.mapper';

export function toGameCategory(dto: GameCategoryResponseDto): GameCategoryModel {
  return {
    id: dto.id,
    image: dto.image,
    info: mapApiLocalized(dto.info, toGameCategoryInfo),
  };
}
