import type { HintModel } from '../../domain/models/hint.model';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { HttpHintsRepository } from './http-hints.repository';
import { createHintCommand, hintFixture } from '../../testing/hint.fixtures';
import { HintEditorMode } from '../../application/workflows/hint-editor.mode';
import { HintOwnerType } from '../../domain/values/hint-owner';
import { HintType } from '../../domain/values/hint-type';
import { SupportedLocale } from '@shared/localization/supported-locale';
import { RequestErrorCode } from '@shared/state/request/request-error';
describe('HTTP hints contract', () => {
  let repository: HttpHintsRepository;
  let http: HttpTestingController;
  const url = environment.apiUrl + '/hints';
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpHintsRepository],
    });
    repository = TestBed.inject(HttpHintsRepository);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
  });
  it.each([HintOwnerType.Movie, HintOwnerType.TvSeries])(
    'creates for %s with a fixed object key and API locale',
    (type) => {
      const result = vi.fn<(hint: HintModel | null) => void>();
      repository.save({ ...createHintCommand(), owner: { id: 'owner', type } }).subscribe(result);
      const request = http.expectOne(url);
      expect(request.request.method).toBe('POST');
      expect(request.request.body).toEqual({
        ownerId: 'owner',
        ownerType: type,
        type: HintType.Plot,
        language: 'en-EN',
        text: 'A clue',
      });
      request.flush({
        data: {
          ...hintFixture(),
          info: [{ id: 'info', language: 'en-EN', text: 'A clue', image: null }],
        },
      });
      expect(result.mock.calls.at(0)?.[0]?.info.at(0)?.language).toBe(SupportedLocale.English);
    },
  );
  it.each([HintType.Actor, HintType.Frame])(
    'creates an image hint without client-owned metadata or text (%s)',
    (type) => {
      repository
        .save({
          mode: HintEditorMode.Create,
          owner: createHintCommand().owner,
          type,
          language: SupportedLocale.Italian,
          fileKey: 'local-file',
        })
        .subscribe();
      const request = http.expectOne(url);
      expect(request.request.body).toEqual({
        ownerId: 'movie',
        ownerType: HintOwnerType.Movie,
        type,
        language: 'it-IT',
      });
      request.flush({ data: hintFixture() });
    },
  );
  it('lists every translation and normalizes API locales', () => {
    const result = vi.fn();
    repository.getByOwner('owner').subscribe(result);
    const request = http.expectOne(url + '/owner/owner');
    expect(request.request.method).toBe('GET');
    request.flush({
      data: [
        {
          ...hintFixture(),
          info: [
            { id: 'en', language: 'en-EN', text: 'Clue', image: null },
            { id: 'it', language: 'it-IT', text: 'Indizio', image: null },
          ],
        },
      ],
    });
    expect(result).toHaveBeenCalledWith([
      expect.objectContaining({
        info: [
          expect.objectContaining({ language: SupportedLocale.English }),
          expect.objectContaining({ language: SupportedLocale.Italian }),
        ],
      }),
    ]);
  });
  it('adds a translation without resending signed image URLs', () => {
    repository
      .save({
        mode: HintEditorMode.Translate,
        owner: createHintCommand().owner,
        hintId: 'hint',
        language: SupportedLocale.Italian,
        text: ' Indizio ',
      })
      .subscribe();
    const request = http.expectOne(url + '/hint/info');
    expect(request.request.body).toEqual({ language: 'it-IT', text: 'Indizio' });
    request.flush({ data: hintFixture() });
  });
  it('uses the proposed PATCH contract and exposes a missing endpoint error without a fallback', () => {
    const error = vi.fn();
    repository
      .save({
        mode: HintEditorMode.Edit,
        owner: createHintCommand().owner,
        hintId: 'hint',
        type: HintType.Plot,
        language: SupportedLocale.English,
        text: 'Changed',
      })
      .subscribe({ error });
    const request = http.expectOne(url + '/hint');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({
      language: 'en-EN',
      text: 'Changed',
    });
    request.flush({}, { status: 404, statusText: 'Not Found' });
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({ code: RequestErrorCode.NotFound, status: 404 }),
    );
  });
  it('deletes without attempting to parse a 204 response', () => {
    const result = vi.fn();
    repository
      .save({ mode: HintEditorMode.Delete, owner: createHintCommand().owner, hintId: 'hint' })
      .subscribe(result);
    const request = http.expectOne(url + '/hint');
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    expect(result).toHaveBeenCalledWith(null);
  });
  it('preserves duplicate-type conflicts', () => {
    const error = vi.fn();
    repository.save(createHintCommand()).subscribe({ error });
    http.expectOne(url).flush({}, { status: 409, statusText: 'Conflict' });
    expect(error).toHaveBeenCalledWith(
      expect.objectContaining({ code: RequestErrorCode.Conflict }),
    );
  });
});
