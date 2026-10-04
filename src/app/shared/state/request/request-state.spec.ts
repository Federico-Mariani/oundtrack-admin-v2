import type { RequestState } from './request-state';
import { isRequestPending, requestError } from './request-state.queries';
import {
  failedRequest,
  idleRequest,
  pendingRequest,
  succeededRequest,
} from './request-state.transitions';

/** Pure unit tests: no Angular, no NgRx. */
describe('RequestState', () => {
  interface TestError {
    code: string;
  }
  const boom: TestError = { code: 'boom' };

  describe('transitions', () => {
    it('starts idle without an error', () => {
      expect(idleRequest<TestError>()).toEqual({ status: 'idle', error: null });
    });

    it('is pending without an error', () => {
      expect(pendingRequest<TestError>()).toEqual({ status: 'pending', error: null });
    });

    it('succeeds without an error', () => {
      expect(succeededRequest<TestError>()).toEqual({ status: 'success', error: null });
    });

    it('stores the error of a failed request', () => {
      expect(failedRequest(boom)).toEqual({ status: 'error', error: boom });
    });

    it('clears a previous error when the request is retried', () => {
      const failed: RequestState<TestError> = failedRequest(boom);
      const retried: RequestState<TestError> =
        failed.status === 'error' ? pendingRequest() : failed;

      expect(retried).toEqual({ status: 'pending', error: null });
    });

    it('returns a fresh value on every call', () => {
      expect(pendingRequest<TestError>()).not.toBe(pendingRequest<TestError>());
    });
  });

  describe('queries', () => {
    it('reports pending only while the request is in flight', () => {
      expect(isRequestPending(pendingRequest<TestError>())).toBe(true);
      expect(isRequestPending(idleRequest<TestError>())).toBe(false);
      expect(isRequestPending(succeededRequest<TestError>())).toBe(false);
      expect(isRequestPending(failedRequest(boom))).toBe(false);
    });

    it('exposes the error of a failed request only', () => {
      expect(requestError(failedRequest(boom))).toBe(boom);
      expect(requestError(idleRequest<TestError>())).toBeNull();
      expect(requestError(pendingRequest<TestError>())).toBeNull();
      expect(requestError(succeededRequest<TestError>())).toBeNull();
    });
  });
});
