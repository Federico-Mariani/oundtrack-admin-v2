import type { Id } from '@shared/types/id';
import type { MovieGenreInfo } from './movie-genre-info.model';
import type { Localized } from '@shared/localization/localized';

export interface MovieGenre {
  readonly id: Id;
  readonly info: Localized<MovieGenreInfo>;
}
