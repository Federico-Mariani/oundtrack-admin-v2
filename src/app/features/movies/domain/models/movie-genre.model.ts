import type { Id } from '@shared/types/id';
import type { MovieGenreInfoModel } from './movie-genre-info.model';
import type { Localized } from '@shared/localization/localized';

export interface MovieGenreModel {
  readonly id: Id;
  readonly info: Localized<MovieGenreInfoModel>;
}
