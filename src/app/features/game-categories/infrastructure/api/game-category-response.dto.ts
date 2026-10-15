import type { Id } from '@shared/types/id';
import type { GameCategoryInfoResponseDto } from './game-category-info-response.dto';

export interface GameCategoryResponseDto {
  readonly id: Id;
  readonly image: string | null;
  readonly info: Array<GameCategoryInfoResponseDto>;
}
