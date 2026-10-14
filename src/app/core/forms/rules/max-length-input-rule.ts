import {
  maxLength,
  type PathKind,
  type SchemaPath,
  type SchemaPathRules,
} from '@angular/forms/signals';
import type { InputRule } from './input-rule';
export class MaxLengthInputRule implements InputRule {
  constructor(private readonly length: number) {}
  apply<TPathKind extends PathKind>(
    _name: string,
    path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
  ): void {
    maxLength(path, this.length);
  }
}
