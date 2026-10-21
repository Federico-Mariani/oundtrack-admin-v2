import type { GameCategoryInfoResponseDto } from '@app/core/catalog/api/game-category-info-response.dto';

export interface GameCategoryResponseDto {
  readonly id: string;
  readonly image: string | null;
  readonly info: Array<GameCategoryInfoResponseDto>;
}
