import { AppFormController } from '@app/core/forms/app-form-controller';
import { AppFormField } from '@app/core/forms/app-form-field';
import { IntegerInputRule } from '@app/core/forms/rules/integer-input-rule';
import { RangeEndInputRule } from '@app/core/forms/rules/range-end-input-rule';
import { MaxLengthInputRule } from '@app/core/forms/rules/max-length-input-rule';
import type { MoviesFilterFormModel } from '../../models/movies-filter-form.model';
export function createMoviesFilterForm(): AppFormController<MoviesFilterFormModel> {
  return new AppFormController<MoviesFilterFormModel>([
    new AppFormField('search', [new MaxLengthInputRule(200)]),
    new AppFormField('releaseYearFrom', [new IntegerInputRule(1, 9998)]),
    new AppFormField('releaseYearTo', [
      new IntegerInputRule(1, 9998),
      new RangeEndInputRule('releaseYearFrom'),
    ]),
    new AppFormField('externalMovieId', [new IntegerInputRule(1, 2147483647)]),
    new AppFormField('sort'),
  ]);
}
