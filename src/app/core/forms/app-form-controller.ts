import {signal, type Signal, type WritableSignal} from '@angular/core';
import {type FieldTree, form, type SchemaPath, validate} from '@angular/forms/signals';
import type {AppFormField} from '@app/core/forms/app-form-field';
import {serverFieldErrors, type ServerFieldErrors} from '@app/core/forms/server-field-errors';

export class AppFormController<MODEL> {
    private readonly _model: WritableSignal<MODEL>;
    private readonly _form: FieldTree<MODEL>;
    private readonly _fields: AppFormField[];
    private readonly _onSubmission: () => void;
    private readonly _serverErrors?: Signal<ServerFieldErrors | null | undefined>;

    constructor(
        fields: AppFormField[],
        onSubmission: () => void,
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
                        rule.apply(field.name, fieldPath);
                    }

                    this._applyServerErrors(field.name, fieldPath);
                }
            },
            {
                submission: {
                    action: async () => {
                        this._onSubmission();
                    },
                },
            },
        );
    }

    /**
     * Binds the API field errors signal to a field: whenever it emits an error
     * for `fieldName`, the message surfaces on that field like any other
     * validation error. Reading the signal inside `validate` keeps it reactive,
     * so errors appear and clear automatically without any imperative wiring.
     */
    private _applyServerErrors(fieldName: string, fieldPath: SchemaPath<string>): void {
        const serverErrors = this._serverErrors;

        if (serverErrors === undefined) {
            return;
        }

        validate(fieldPath, () => serverFieldErrors(serverErrors(), fieldName));
    }
}
