import {
  type PathKind,
  required,
  type SchemaPath,
  type SchemaPathRules,
} from '@angular/forms/signals';

export class RequiredInputRule {
  apply<TPathKind extends PathKind>(
    name: string,
    path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
  ): void {
    required(path, { message: `${name} is a required field.` });
  }
}
