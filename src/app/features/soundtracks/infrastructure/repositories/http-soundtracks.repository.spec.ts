import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '@environments/environment';
import { SoundtrackOwnerType } from '../../domain/ownership/soundtrack-owner';
import { HttpSoundtracksRepository } from './http-soundtracks.repository';

describe('Soundtrack owner transport', () => {
  it.each([
    { type: SoundtrackOwnerType.Movie, wireType: 'movie' },
    { type: SoundtrackOwnerType.TvSeries, wireType: 'tv_series' },
  ])('preserves the $wireType owner and API language mapping', ({ type, wireType }) => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), HttpSoundtracksRepository],
    });
    const http = TestBed.inject(HttpTestingController);
    const received = vi.fn();
    TestBed.inject(HttpSoundtracksRepository)
      .create({ type, id: 'owner' }, 'external-track', ['en-US', 'it-IT'])
      .subscribe(received);
    const request = http.expectOne(environment.apiUrl + '/soundtracks');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      ownerType: wireType,
      ownerId: 'owner',
      trackExternalId: 'external-track',
      languages: ['en-EN', 'it-IT'],
    });
    request.flush({
      data: {
        id: 'soundtrack',
        tracks: [
          {
            id: 'track',
            externalId: 'external-track',
            name: 'Name',
            artist: 'Artist',
            path: null,
            languages: ['en-EN', 'it-IT'],
          },
        ],
      },
    });
    expect(received).toHaveBeenCalledWith(
      expect.objectContaining({
        tracks: [expect.objectContaining({ languages: ['en-US', 'it-IT'] })],
      }),
    );
    http.verify();
  });
});
