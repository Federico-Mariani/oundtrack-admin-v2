import {
  type Action,
  type ActionCreator,
  type ActionCreatorProps,
  createAction,
  type NotAllowedCheck,
  props,
} from '@ngrx/store';
import type { RequestError } from '../request/request-error';

type RequestPayload = object | null;
type FailedPayload = { error: RequestError } | null;

type PayloadAction<T extends object> = ActionCreator<
  string,
  (payload: T & NotAllowedCheck<T>) => T & Action
>;

type EmptyAction = ActionCreator<string, () => Action>;

type RequestAction<T extends RequestPayload> = [T] extends [null]
  ? EmptyAction
  : PayloadAction<Extract<T, object>>;

type PayloadFlag<T extends RequestPayload> = [T] extends [null] ? false : true;

interface RequestPayloadConfiguration<
  Requested extends RequestPayload,
  Succeeded extends RequestPayload,
  Failed extends FailedPayload,
> {
  requested: PayloadFlag<Requested>;
  succeeded: PayloadFlag<Succeeded>;
  failed: PayloadFlag<Failed>;
}

interface EmptyRequestPayloadConfiguration<
  Succeeded extends RequestPayload,
  Failed extends FailedPayload,
> {
  succeeded: PayloadFlag<Succeeded>;
  failed: PayloadFlag<Failed>;
}

type RequestConfigurationArguments<
  Requested extends RequestPayload,
  Succeeded extends RequestPayload,
  Failed extends FailedPayload,
> = [Extract<Requested | Succeeded | Failed, null>] extends [never]
  ? [configuration?: RequestPayloadConfiguration<Requested, Succeeded, Failed>]
  : [configuration: RequestPayloadConfiguration<Requested, Succeeded, Failed>];

type EmptyRequestConfigurationArguments<
  Succeeded extends RequestPayload,
  Failed extends FailedPayload,
> = [Extract<Succeeded | Failed, null>] extends [never]
  ? [configuration?: EmptyRequestPayloadConfiguration<Succeeded, Failed>]
  : [configuration: EmptyRequestPayloadConfiguration<Succeeded, Failed>];

export interface RequestActions<
  Requested extends RequestPayload,
  Succeeded extends RequestPayload,
  Failed extends FailedPayload,
> {
  requested: RequestAction<Requested>;
  reset: EmptyAction;
  succeeded: RequestAction<Succeeded>;
  failed: RequestAction<Failed>;
}

export interface EmptyRequestActions<
  Succeeded extends RequestPayload,
  Failed extends FailedPayload,
> {
  requested: EmptyAction;
  reset: EmptyAction;
  succeeded: RequestAction<Succeeded>;
  failed: RequestAction<Failed>;
}

function createPayloadAction<T extends object>(type: string): PayloadAction<T> {
  return createAction(type, props<T, T>() as ActionCreatorProps<T> & NotAllowedCheck<T>);
}

function createOptionalPayloadAction<T extends RequestPayload>(
  type: string,
  hasPayload: boolean,
): RequestAction<T> {
  const action = hasPayload ? createPayloadAction<Extract<T, object>>(type) : createAction(type);

  return action as RequestAction<T>;
}

export function createRequestActions<
  Requested extends RequestPayload,
  Succeeded extends RequestPayload,
  Failed extends FailedPayload,
>(
  feature: string,
  operation: string,
  ...[configuration]: RequestConfigurationArguments<Requested, Succeeded, Failed>
): RequestActions<Requested, Succeeded, Failed> {
  const source = `${feature} ${operation}`;

  return {
    requested: createOptionalPayloadAction<Requested>(
      `[${source}] Requested`,
      configuration?.requested ?? true,
    ),
    reset: createAction(`[${source}] Reset`),
    succeeded: createOptionalPayloadAction<Succeeded>(
      `[${source} API] Succeeded`,
      configuration?.succeeded ?? true,
    ),
    failed: createOptionalPayloadAction<Failed>(
      `[${source} API] Failed`,
      configuration?.failed ?? true,
    ),
  };
}

export function createEmptyRequestActions<
  Succeeded extends RequestPayload,
  Failed extends FailedPayload,
>(
  feature: string,
  operation: string,
  ...[configuration]: EmptyRequestConfigurationArguments<Succeeded, Failed>
): EmptyRequestActions<Succeeded, Failed> {
  const source = `${feature} ${operation}`;

  return {
    requested: createAction(`[${source}] Requested`),
    reset: createAction(`[${source}] Reset`),
    succeeded: createOptionalPayloadAction<Succeeded>(
      `[${source} API] Succeeded`,
      configuration?.succeeded ?? true,
    ),
    failed: createOptionalPayloadAction<Failed>(
      `[${source} API] Failed`,
      configuration?.failed ?? true,
    ),
  };
}
