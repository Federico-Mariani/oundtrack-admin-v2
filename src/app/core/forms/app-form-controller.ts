import { signal, type Signal, type WritableSignal } from '@angular/core';
import { type FieldTree, form, type SchemaPath, validate } from '@angular/forms/signals';
import type { AppFormField } from '@app/core/forms/app-form-field';
import { serverFieldErrors, type ServerFieldErrors } from '@app/core/forms/server-field-errors';

export class AppFormController<MODEL> {
  private readonly _model: WritableSignal<MODEL>;
  private readonly _form: FieldTree<MODEL>;
  private readonly _fields: Array<AppFormField>;
  private readonly _onSubmission: (() => void) | undefined;
  private readonly _serverErrors?: Signal<ServerFieldErrors | null | undefined>;

  /**
   * Snapshot of the field values at the moment the form was submitted. Server
   * errors belong to those exact values, so a field surfaces its server error
   * only while its value still matches the submitted one; editing the field
   * clears the stale error automatically.
   */
  private readonly _submittedValues: WritableSignal<Readonly<Record<string, string>> | null> =
    signal(null);

  constructor(
    fields: Array<AppFormField>,
    onSubmission?: () => void,
    serverErrors?: Signal<ServerFieldErrors | null | undefined>,
  ) {
    this._fields = fields;
    this._onSubmission = onSubmission;
    this._serverErrors = serverErrors;
    this._model = this._createModel();
    this._form = this._createForm();
  }

  get model(): WritableSignal<MODEL> {
    return this._model;
  }

  get form(): FieldTree<MODEL> {
    return this._form;
  }

  private _createModel(): WritableSignal<MODEL> {
    const initialValue = this._fields.reduce<Record<string, string>>((model, field) => {
      model[field.name] = '';

      return model;
    }, {});

    return signal(initialValue as MODEL);
  }

  private _createForm(): FieldTree<MODEL> {
    return form(
      this._model,
      (schemaPath) => {
        const fieldPaths = schemaPath as Record<string, SchemaPath<string>>;

        for (const field of this._fields) {
          const fieldPath = fieldPaths[field.name];

          for (const rule of field.rules) {
            rule.apply(field.name, fieldPath, fieldPaths);
          }

          this._applyServerErrors(field.name, fieldPath);
        }
      },
      {
        submission: {
          action: () => {
            this._captureSubmittedValues();
            this._onSubmission?.();

            return Promise.resolve();
          },
        },
      },
    );
  }

  /**
   * Records the submitted value of every field, so later edits can be detected
   * and the server errors tied to the submitted values can be discarded.
   */
  private _captureSubmittedValues(): void {
    const model = this._model() as Record<string, string>;
    const submitted = this._fields.reduce<Record<string, string>>((values, field) => {
      values[field.name] = model[field.name];

      return values;
    }, {});

    this._submittedValues.set(submitted);
  }

  /**
   * Binds the API field errors signal to a field: whenever it emits an error
   * for `fieldName`, the message surfaces on that field like any other
   * validation error. Reading the signal inside `validate` keeps it reactive,
   * so errors appear and clear automatically without any imperative wiring.
   *
   * The error is kept only while the field still holds the value that was
   * submitted: as soon as the user edits the field its value diverges from the
   * submitted snapshot and the stale server error disappears.
   */
  private _applyServerErrors(fieldName: string, fieldPath: SchemaPath<string>): void {
    const serverErrors = this._serverErrors;

    if (serverErrors === undefined) {
      return;
    }

    validate(fieldPath, ({ value }) => {
      const submitted = this._submittedValues();

      if (submitted?.[fieldName] !== value()) {
        return [];
      }

      return serverFieldErrors(serverErrors(), fieldName);
    });
  }
}
