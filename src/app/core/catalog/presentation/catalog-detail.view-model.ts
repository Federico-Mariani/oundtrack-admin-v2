import type { Id } from '@shared/types/id';
import type { Localized } from '@shared/localization/localized';
import type { GenreModel } from '@shared/types/catalog/genre.model';
import type { GameCategoryModel } from '@shared/types/catalog/game-category.model';
import type { SoundtrackModel } from '@shared/types/catalog/soundtrack.model';
import type { CatalogTranslationViewModel } from './catalog-translation.view-model';
export interface CatalogDetailViewModel {
  readonly id: Id;
  readonly externalId: number;
  readonly info: Localized<CatalogTranslationViewModel>;
  readonly genres: ReadonlyArray<GenreModel>;
  readonly gameCategories: ReadonlyArray<GameCategoryModel>;
  readonly soundtracks: ReadonlyArray<SoundtrackModel>;
  readonly createdAt: number;
  readonly updatedAt: number;
}
