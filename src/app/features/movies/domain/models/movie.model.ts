import type { Id } from '@shared/types/id';
import type { GenreModel } from '@shared/types/catalog/genre.model';
import type { MovieInfoModel } from './movie-info.model';
import type { Localized } from '@shared/localization/localized';

export interface MovieModel {
  readonly id: Id;
  readonly externalMovieId: number;
  readonly genres: ReadonlyArray<GenreModel>;
  readonly info: Localized<MovieInfoModel>;
  readonly createdAt: number;
  readonly updatedAt: number;
}
