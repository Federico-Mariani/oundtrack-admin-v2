import type {ApiErrorCode} from "./api-error-code";

export interface ApiError {
    readonly code: ApiErrorCode;
    readonly status: number;
    readonly message?: string;
    readonly fieldErrors?: Readonly<
        Record<string, readonly string[]>
    >;
}