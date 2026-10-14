import {
  validate,
  type PathKind,
  type SchemaPath,
  type SchemaPathRules,
} from '@angular/forms/signals';
import type { InputRule } from './input-rule';
/** Optional integer within inclusive bounds. Empty values remove a criterion. */
export class IntegerInputRule implements InputRule {
  constructor(
    private readonly min: number,
    private readonly max: number,
  ) {}
  apply<TPathKind extends PathKind>(
    _name: string,
    path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
  ): void {
    validate(path, ({ value }) => {
      const raw = value().trim();
      if (!raw) {
        return [];
      }
      const n = Number(raw);
      return Number.isInteger(n) && n >= this.min && n <= this.max
        ? []
        : [{ kind: 'integerRange', min: this.min, max: this.max }];
    });
  }
}
