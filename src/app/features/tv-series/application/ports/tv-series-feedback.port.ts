import type { RequestError } from '@shared/state/request/request-error';

export interface TvSeriesFeedbackPort {
  createInfoSucceeded(): void;
  createInfoFailed(error: RequestError): void;
  createTvSeriesSucceeded(): void;
  createTvSeriesFailed(error: RequestError): void;
  getAllTvSeriesFailed(error: RequestError): void;
}
