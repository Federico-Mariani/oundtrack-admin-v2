import {
  validate,
  type PathKind,
  type SchemaPath,
  type SchemaPathRules,
} from '@angular/forms/signals';
import type { InputRule } from './input-rule';
export class RangeEndInputRule implements InputRule {
  constructor(private readonly startField: string) {}
  apply<TPathKind extends PathKind>(
    _name: string,
    path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
    fields: Readonly<Record<string, SchemaPath<string>>>,
  ): void {
    const startPath = fields[this.startField];
    validate(path, (context) => {
      const end = context.value().trim();
      const start = context.valueOf(startPath).trim();
      return end && start && Number(end) < Number(start) ? [{ kind: 'rangeEnd' }] : [];
    });
  }
}
