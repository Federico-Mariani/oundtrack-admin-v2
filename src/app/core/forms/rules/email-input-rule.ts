import {
  email,
  type PathKind,
  type SchemaPath,
  type SchemaPathRules,
} from '@angular/forms/signals';
import type { InputRule } from './input-rule';

/**
 * Validates that a field holds a well-formed email. It carries no user-facing
 * text: the produced validation error exposes the semantic `kind` (`'email'`),
 * and the presentation layer maps that code to a localized message. This keeps
 * `core/forms` free of any i18n concern.
 */
export class EmailInputRule implements InputRule {
  apply<TPathKind extends PathKind>(
    _name: string,
    path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
  ): void {
    email(path);
  }
}
