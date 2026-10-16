import {
  type Action,
  type ActionCreator,
  type ActionCreatorProps,
  createAction,
  type NotAllowedCheck,
  props,
} from '@ngrx/store';
import type { RequestError } from '../request/request-error';

type PayloadAction<T extends object> = ActionCreator<
  string,
  (payload: T & NotAllowedCheck<T>) => T & Action
>;

type EmptyAction = ActionCreator<string, () => Action>;

export interface RequestActions<
  Requested extends object,
  Succeeded extends object,
  Failed extends { error: RequestError },
> {
  requested: PayloadAction<Requested>;
  reset: EmptyAction;
  succeeded: PayloadAction<Succeeded>;
  failed: PayloadAction<Failed>;
}

export interface EmptyRequestActions<
  Succeeded extends object,
  Failed extends { error: RequestError },
> {
  requested: EmptyAction;
  reset: EmptyAction;
  succeeded: PayloadAction<Succeeded>;
  failed: PayloadAction<Failed>;
}

function createPayloadAction<T extends object>(type: string): PayloadAction<T> {
  return createAction(type, props<T, T>() as ActionCreatorProps<T> & NotAllowedCheck<T>);
}

export function createRequestActions<
  Requested extends object,
  Succeeded extends object,
  Failed extends { error: RequestError },
>(feature: string, operation: string): RequestActions<Requested, Succeeded, Failed> {
  const source = `${feature} ${operation}`;

  return {
    requested: createPayloadAction<Requested>(`[${source}] Requested`),
    reset: createAction(`[${source}] Reset`),
    succeeded: createPayloadAction<Succeeded>(`[${source} API] Succeeded`),
    failed: createPayloadAction<Failed>(`[${source} API] Failed`),
  };
}

export function createEmptyRequestActions<
  Succeeded extends object,
  Failed extends { error: RequestError },
>(feature: string, operation: string): EmptyRequestActions<Succeeded, Failed> {
  const source = `${feature} ${operation}`;

  return {
    requested: createAction(`[${source}] Requested`),
    reset: createAction(`[${source}] Reset`),
    succeeded: createPayloadAction<Succeeded>(`[${source} API] Succeeded`),
    failed: createPayloadAction<Failed>(`[${source} API] Failed`),
  };
}
