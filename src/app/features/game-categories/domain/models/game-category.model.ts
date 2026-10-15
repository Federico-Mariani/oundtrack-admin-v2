import type { Id } from '@shared/types/id';
import type { Localized } from '@shared/localization/localized';
import type { GameCategoryInfoModel } from './game-category-info.model';

export interface GameCategoryModel {
  readonly id: Id;
  readonly image: string | null;
  readonly info: Localized<GameCategoryInfoModel>;
}
