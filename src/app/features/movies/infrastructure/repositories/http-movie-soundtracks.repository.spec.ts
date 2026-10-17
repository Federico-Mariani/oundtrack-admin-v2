import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { environment } from '@environments/environment';
import { DirectAudioUpload } from '@app/core/uploads/direct-audio-upload';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { HttpMovieSoundtracksRepository } from './http-movie-soundtracks.repository';

describe('Movie soundtrack API contracts', () => {
  const base = environment.apiUrl + '/soundtracks';
  const dto = {
    id: 'track',
    externalId: 'spotify',
    name: 'Stay',
    artist: 'Zimmer',
    path: null,
    languages: ['en-EN'],
  };
  const direct = { put: vi.fn<DirectAudioUpload['put']>() };
  let repository: HttpMovieSoundtracksRepository;
  let http: HttpTestingController;
  beforeEach(() => {
    direct.put.mockReset().mockReturnValue(of(100));
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpMovieSoundtracksRepository,
        { provide: DirectAudioUpload, useValue: direct },
      ],
    });
    repository = TestBed.inject(HttpMovieSoundtracksRepository);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    http.verify();
  });
  it('creates a movie soundtrack with a provider ID and API locales', () => {
    const result = vi.fn();
    repository.create('movie', 'spotify', ['en-US']).subscribe(result);
    const request = http.expectOne(base);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      ownerType: 'movie',
      ownerId: 'movie',
      trackExternalId: 'spotify',
      languages: ['en-EN'],
    });
    request.flush({ data: { id: 'soundtrack', tracks: [dto] } });
    expect(result).toHaveBeenCalledWith({
      id: 'soundtrack',
      tracks: [{ ...dto, languages: ['en-US'] }],
    });
  });
  it('adds versions and patches languages using plural endpoints', () => {
    repository.addTrack('soundtrack', 'spotify', ['en-US', 'it-IT']).subscribe();
    const create = http.expectOne(base + '/soundtrack/tracks');
    expect(create.request.body).toEqual({ externalId: 'spotify', languages: ['en-EN', 'it-IT'] });
    create.flush({ data: dto });
    repository.languages('track', ['en-US']).subscribe();
    const update = http.expectOne(base + '/tracks/track/languages');
    expect(update.request.method).toBe('PATCH');
    expect(update.request.body).toEqual({ languages: ['en-EN'] });
    update.flush({ data: dto });
  });
  it('requests a fresh signed URL, sends the raw file through the isolated upload client, then confirms', () => {
    const file = new File(['ID3audio'], 'recording.mp3', { type: 'audio/mpeg' });
    const files = TestBed.inject(UploadFiles);
    const key = files.register(file);
    repository.upload('track', key).subscribe();
    const signing = http.expectOne(base + '/tracks/track/upload-url');
    expect(signing.request.method).toBe('POST');
    signing.flush({
      data: {
        trackId: 'track',
        key: 'tracks/movie/movie/track.mp3',
        url: 'https://storage.test/signed',
        method: 'PUT',
        headers: { 'Content-Type': 'audio/mpeg' },
        expiresInSeconds: 900,
      },
    });
    expect(direct.put).toHaveBeenCalledWith(
      'https://storage.test/signed',
      { 'Content-Type': 'audio/mpeg' },
      file,
    );
    repository.complete('track').subscribe();
    const complete = http.expectOne(base + '/tracks/track/upload/complete');
    expect(complete.request.method).toBe('POST');
    complete.flush({ data: { ...dto, path: 'https://media.test/audio.mp3' } });
    files.release(key);
  });
  it('keeps API field errors and hides storage responses', () => {
    const errors = vi.fn();
    repository.languages('track', ['en-US']).subscribe({ error: errors });
    http
      .expectOne(base + '/tracks/track/languages')
      .flush({ message: 'Occupied' }, { status: 409, statusText: 'Conflict' });
    expect(errors).toHaveBeenCalledWith(expect.objectContaining({ status: 409, code: 'conflict' }));
  });
});
