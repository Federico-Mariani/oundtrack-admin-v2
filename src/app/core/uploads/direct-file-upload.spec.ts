import { TestBed } from '@angular/core/testing';
import {
  HttpEventType,
  HttpResponse,
  HttpXhrBackend,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { of } from 'rxjs';
import { DirectFileUpload } from './direct-file-upload';
describe('Direct audio transport', () => {
  it('sends raw bytes without API interceptors and only reports completion after the storage response', () => {
    const intercepted = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(
          withInterceptors([
            (request, next) => {
              intercepted();
              return next(request.clone({ setHeaders: { Authorization: 'Bearer api-token' } }));
            },
          ]),
        ),
      ],
    });
    const transport = vi
      .spyOn(HttpXhrBackend.prototype, 'handle')
      .mockReturnValue(
        of(
          { type: HttpEventType.UploadProgress as const, loaded: 8, total: 8 },
          new HttpResponse({ status: 200, body: '' }),
        ),
      );
    const file = new File(['ID3audio'], 'audio.mp3');
    const progress: Array<number> = [];
    TestBed.inject(DirectFileUpload)
      .put('https://storage.test/signed', { 'Content-Type': 'audio/mpeg' }, file)
      .subscribe((value) => progress.push(value));
    const request = transport.mock.calls[0][0];
    expect(request.method).toBe('PUT');
    expect(request.body).toBe(file);
    expect(request.headers.get('Content-Type')).toBe('audio/mpeg');
    expect(request.headers.has('Authorization')).toBe(false);
    expect(intercepted).not.toHaveBeenCalled();
    expect(progress).toEqual([99, 100]);
    transport.mockRestore();
  });
});
