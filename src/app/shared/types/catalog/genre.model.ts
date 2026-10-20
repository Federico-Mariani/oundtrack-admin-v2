import type { Id } from '@shared/types/id';
import type { GenreInfoModel } from '@shared/types/catalog/genre-info.model';
import type { Localized } from '@shared/localization/localized';

export interface GenreModel {
  readonly id: Id;
  readonly info: Localized<GenreInfoModel>;
}
