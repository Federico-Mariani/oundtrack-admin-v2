import type { Id } from '@shared/types/id';
import type { Localized } from '@shared/localization/localized';
import type { MovieGameCategoryInfoModel } from './movie-game-category-info.model';

export interface MovieGameCategoryModel {
  readonly id: Id;
  readonly image: string | null;
  readonly info: Localized<MovieGameCategoryInfoModel>;
}
