import type { Id } from '@shared/types/id';
import type { MovieGenre } from './movie-genre.model';
import type { MovieInfo } from './movie-info.model';
import type { Localized } from '@shared/localization/localized';

export interface Movie {
  readonly id: Id;
  readonly externalMovieId: number;
  readonly genres: readonly MovieGenre[];
  readonly info: Localized<MovieInfo>;
  readonly createdAt: number;
  readonly updatedAt: number;
}
