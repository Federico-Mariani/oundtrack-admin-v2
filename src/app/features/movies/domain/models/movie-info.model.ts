import type { Id } from '@shared/types/id';

export interface MovieInfo {
  readonly id: Id;
  readonly title: string;
  readonly releaseDate: number;
  readonly posterUrl: string;
  readonly backdropUrl: string;
  readonly createdAt: number;
  readonly updatedAt: number;
}
