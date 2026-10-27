import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpAvatarsRepository } from './http-avatars.repository';
import { DirectFileUpload } from '@app/core/uploads/direct-file-upload';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { environment } from '@environments/environment';
const response = { id: 'avatar', path: 'signed-image', createdAt: 0, updatedAt: 1 };
describe('Avatar HTTP contract', () => {
  const put = vi.fn().mockReturnValue(of(50, 100));
  beforeEach(() => {
    put.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpAvatarsRepository,
        { provide: DirectFileUpload, useValue: { put } },
      ],
    });
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });
  it('loads all catalog avatars', () => {
    const received = vi.fn();
    TestBed.inject(HttpAvatarsRepository).getAll().subscribe(received);
    TestBed.inject(HttpTestingController)
      .expectOne(environment.apiUrl + '/avatars')
      .flush({ data: [response] });
    expect(received).toHaveBeenCalledWith([response]);
  });
  it.each([undefined, 'avatar'])('uploads and confirms for target %s', (avatarId) => {
    const repository = TestBed.inject(HttpAvatarsRepository),
      http = TestBed.inject(HttpTestingController),
      file = new File(['image'], 'avatar.png', { type: 'image/png' }),
      fileKey = TestBed.inject(UploadFiles).register(file),
      progress = vi.fn();
    repository.upload(fileKey).subscribe(progress);
    const upload = http.expectOne(environment.apiUrl + '/avatars/upload-url');
    expect(upload.request.body).toEqual({ contentType: 'image/png' });
    upload.flush({
      data: {
        url: 'https://storage.test/signed',
        key: 'owned-key',
        headers: { 'Content-Type': 'image/png' },
      },
    });
    expect(put).toHaveBeenCalledWith(
      'https://storage.test/signed',
      { 'Content-Type': 'image/png' },
      file,
    );
    expect(progress).toHaveBeenLastCalledWith({ progress: 100, key: 'owned-key' });
    repository.complete(fileKey, 'owned-key', avatarId).subscribe();
    const complete = http.expectOne(
      environment.apiUrl +
        (avatarId ? '/avatars/avatar/upload/complete' : '/avatars/upload/complete'),
    );
    expect(complete.request.body).toEqual({ key: 'owned-key', contentType: 'image/png' });
    complete.flush({ data: response });
  });
  it('rejects missing local files before issuing a request', () => {
    const error = vi.fn();
    TestBed.inject(HttpAvatarsRepository).upload('missing').subscribe({ error });
    expect(error).toHaveBeenCalledWith({ code: 'validation' });
    TestBed.inject(HttpTestingController).expectNone(environment.apiUrl + '/avatars/upload-url');
  });
});
