import {email, type PathKind, type SchemaPath, type SchemaPathRules,} from '@angular/forms/signals';

export class EmailInputRule {
    apply<TPathKind extends PathKind>(
        name: string,
        path: SchemaPath<string, SchemaPathRules.Supported, TPathKind>,
    ): void {
        email(path, {message: 'Email must be a valid email address.'});
    }
}
