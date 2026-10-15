import type { MovieGameCategoryInfoResponseDto } from './movie-game-category-info-response.dto';

export interface MovieGameCategoryResponseDto {
  readonly id: string;
  readonly image: string | null;
  readonly info: Array<MovieGameCategoryInfoResponseDto>;
}
