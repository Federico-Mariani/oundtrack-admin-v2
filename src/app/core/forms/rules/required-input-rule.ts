import {
  type PathKind,
  required,
  type SchemaPath,
  type SchemaPathRules,
} from '@angular/forms/signals';
import type { InputRule } from './input-rule';

/**
 * Marks a field as required. It carries no user-facing text: the produced
 * validation error exposes the semantic `kind` (`'required'`), and the
 * presentation layer maps that code to a localized message. This keeps
 * `core/forms` free of any i18n concern.
 */
export class RequiredInputRule implements InputRule {
  apply<TPathKind extends PathKind>(
    _name: string,
    path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
  ): void {
    required(path);
  }
}
