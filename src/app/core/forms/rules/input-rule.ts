import type { PathKind, SchemaPath, SchemaPathRules } from '@angular/forms/signals';

/**
 * Contract shared by every form input validation rule. A rule applies one
 * validation constraint (and its user-facing message) to a given field path.
 */
export interface InputRule {
  apply<TPathKind extends PathKind>(
    name: string,
    path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
  ): void;
}
