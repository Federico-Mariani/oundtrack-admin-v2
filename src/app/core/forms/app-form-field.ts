import type {RequiredInputRule} from '@app/core/forms/rules/required-input-rule';

export class AppFormField {
  private readonly _name: string;
  private readonly _rules: RequiredInputRule[];

  constructor(name: string, rules: RequiredInputRule[] = []) {
    this._name = name;
    this._rules = rules;
  }

  get name(): string {
    return this._name;
  }

  get rules(): RequiredInputRule[] {
    return this._rules;
  }
}
