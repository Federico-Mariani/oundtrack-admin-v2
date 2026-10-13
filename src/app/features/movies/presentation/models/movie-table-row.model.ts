import type { Id } from '@shared/types/id';

export interface MovieTableRowModel {
  readonly id: Id;
  readonly externalMovieId: number;
  readonly title: string;
  readonly genres: string;
  readonly releaseDate: number | undefined;
  readonly releaseDateLabel: string;
  readonly posterUrl: string | null;
}
