import {
  validate,
  type PathKind,
  type SchemaPath,
  type SchemaPathRules,
} from '@angular/forms/signals';
import type { InputRule } from './input-rule';
export class NonBlankInputRule implements InputRule {
  apply<TPathKind extends PathKind>(
    _name: string,
    path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
  ): void {
    validate(path, ({ value }) =>
      value().length > 0 && !value().trim() ? [{ kind: 'required' }] : [],
    );
  }
}
