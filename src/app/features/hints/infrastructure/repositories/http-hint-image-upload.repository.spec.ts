import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { DirectFileUpload } from '@app/core/uploads/direct-file-upload';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { HttpHintImageUploadRepository } from './http-hint-image-upload.repository';
import { hintFixture } from '../../testing/hint.fixtures';
import { RequestErrorCode } from '@shared/state/request/request-error';
describe('Hint image HTTP workflow', () => {
  let repository: HttpHintImageUploadRepository;
  let http: HttpTestingController;
  let files: UploadFiles;
  const put = vi.fn<DirectFileUpload['put']>();
  const base = environment.apiUrl + '/hints/hint/image';
  beforeEach(() => {
    vi.resetAllMocks();
    put.mockReturnValue(of(45, 100));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpHintImageUploadRepository,
        { provide: DirectFileUpload, useValue: { put } },
      ],
    });
    repository = TestBed.inject(HttpHintImageUploadRepository);
    http = TestBed.inject(HttpTestingController);
    files = TestBed.inject(UploadFiles);
  });
  afterEach(() => {
    http.verify();
  });
  it.each(['image/jpeg', 'image/png'])(
    'requests a signed URL and forwards bytes and signed headers for %s',
    (contentType) => {
      const file = new File(['image'], 'image', { type: contentType }),
        key = files.register(file),
        progress = vi.fn();
      repository.upload('hint', key).subscribe(progress);
      const request = http.expectOne(base + '/upload-url');
      expect(request.request.body).toEqual({ contentType });
      request.flush({
        data: {
          url: 'https://storage.test/object',
          headers: { 'Content-Type': contentType },
          method: 'PUT',
          key: 'hints/owner/hint.jpg',
          expiresInSeconds: 900,
        },
      });
      expect(put).toHaveBeenCalledWith(
        'https://storage.test/object',
        { 'Content-Type': contentType },
        file,
      );
      expect(progress).toHaveBeenLastCalledWith(100);
    },
  );
  it('confirms with content type and maps the full returned hint', () => {
    const key = files.register(new File(['image'], 'image.png', { type: 'image/png' })),
      result = vi.fn();
    repository.complete('hint', key).subscribe(result);
    const request = http.expectOne(base + '/complete');
    expect(request.request.body).toEqual({ contentType: 'image/png' });
    request.flush({ data: hintFixture() });
    expect(result).toHaveBeenCalledWith(hintFixture());
  });
  it('rejects missing or unsupported local files before requesting an upload URL', () => {
    const error = vi.fn();
    repository.upload('hint', 'missing').subscribe({ error });
    const key = files.register(new File(['image'], 'image.svg', { type: 'image/svg+xml' }));
    repository.upload('hint', key).subscribe({ error });
    expect(error).toHaveBeenCalledTimes(2);
    http.expectNone(base + '/upload-url');
  });
  it('preserves API failures and does not upload after a rejected URL request', () => {
    const key = files.register(new File(['image'], 'image.png', { type: 'image/png' })),
      error = vi.fn();
    repository.upload('hint', key).subscribe({ error });
    http.expectOne(base + '/upload-url').flush({}, { status: 403, statusText: 'Forbidden' });
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({ code: RequestErrorCode.Forbidden }),
    );
    expect(put).not.toHaveBeenCalled();
  });
  it('maps a storage network failure without confirming the image', () => {
    const key = files.register(new File(['image'], 'image.png', { type: 'image/png' })),
      error = vi.fn();
    put.mockReturnValue(throwError(() => new Error('Offline')));
    repository.upload('hint', key).subscribe({ error });
    http.expectOne(base + '/upload-url').flush({
      data: {
        url: 'https://storage.test/object',
        headers: { 'Content-Type': 'image/png' },
        method: 'PUT',
      },
    });
    expect(error).toHaveBeenCalled();
    http.expectNone(base + '/complete');
  });
});
