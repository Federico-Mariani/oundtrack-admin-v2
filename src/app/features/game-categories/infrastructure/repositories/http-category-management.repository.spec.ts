import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpCategoryManagementRepository } from './http-category-management.repository';
import { DirectFileUpload } from '@app/core/uploads/direct-file-upload';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { environment } from '@environments/environment';
import { SupportedLocale } from '@shared/localization/supported-locale';
const response = {
  id: 'category',
  image: null,
  info: [{ id: 'info', language: 'en-EN', name: 'Movies' }],
};
describe('Category management HTTP contract', () => {
  const put = vi.fn().mockReturnValue(of(50, 100));
  beforeEach(() => {
    put.mockClear();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpCategoryManagementRepository,
        { provide: DirectFileUpload, useValue: { put } },
      ],
    });
  });
  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });
  it('creates names with API locales and updates info on the same identity', () => {
    const repository = TestBed.inject(HttpCategoryManagementRepository),
      result = vi.fn();
    repository.saveName(undefined, ' Movies ', SupportedLocale.English).subscribe(result);
    const create = TestBed.inject(HttpTestingController).expectOne(
      environment.apiUrl + '/game-categories',
    );
    expect(create.request.body).toEqual({ name: 'Movies', language: 'en-EN' });
    create.flush({ data: response });
    expect(result).toHaveBeenCalledWith(
      expect.objectContaining({ info: { 'en-US': { id: 'info', name: 'Movies' } } }),
    );
    repository.saveName('category', 'Film', SupportedLocale.Italian).subscribe();
    const info = TestBed.inject(HttpTestingController).expectOne(
      environment.apiUrl + '/game-categories/category/info',
    );
    expect(info.request.body).toEqual({ name: 'Film', language: 'it-IT' });
    info.flush({ data: response });
  });
  it('uses a signed direct transfer and confirms the exact returned key', () => {
    const repository = TestBed.inject(HttpCategoryManagementRepository),
      file = new File(['image'], 'icon.png', { type: 'image/png' }),
      fileKey = TestBed.inject(UploadFiles).register(file),
      progress = vi.fn();
    repository.upload('category', fileKey).subscribe(progress);
    const upload = TestBed.inject(HttpTestingController).expectOne(
      environment.apiUrl + '/game-categories/category/icon/upload-url',
    );
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
    repository.complete('category', fileKey, 'owned-key').subscribe();
    const complete = TestBed.inject(HttpTestingController).expectOne(
      environment.apiUrl + '/game-categories/category/icon/complete',
    );
    expect(complete.request.body).toEqual({ key: 'owned-key', contentType: 'image/png' });
    complete.flush({ data: response });
  });
});
