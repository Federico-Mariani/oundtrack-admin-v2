import type { InputRule } from '@app/core/forms/rules/input-rule';

export class AppFormField {
  private readonly _name: string;
  private readonly _rules: InputRule[];

  constructor(name: string, rules: InputRule[] = []) {
    this._name = name;
    this._rules = rules;
  }

  get name(): string {
    return this._name;
  }

  get rules(): InputRule[] {
    return this._rules;
  }
}
