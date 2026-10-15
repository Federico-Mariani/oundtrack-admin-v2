import type { Id } from '@shared/types/id';

export interface GameCategoryInfoResponseDto {
  readonly id: Id;
  readonly name: string;
  readonly language: string;
}
