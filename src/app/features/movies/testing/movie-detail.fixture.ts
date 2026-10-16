import type { MovieDetailResponseDto } from '../infrastructure/api/movie-detail-response.dto';

export function movieDetailResponse(): MovieDetailResponseDto {
  return {
    id: 'movie-one',
    externalMovieId: 157336,
    createdAt: 1790340847920,
    updatedAt: 1790340847920,
    genres: [{ id: 'genre', info: [{ id: 'genre-info', name: 'Avventura', language: 'it-IT' }] }],
    info: [
      {
        id: 'info-it',
        language: 'it-IT',
        title: 'Interstellar',
        releaseDate: 1415145600000,
        posterUrl: 'https://www.themoviedb.org/t/p/w500/poster.jpg',
        backdropUrl: 'https://www.themoviedb.org/t/p/w500/backdrop.jpg',
        createdAt: 1790340848056,
        updatedAt: 1790340848056,
      },
      {
        id: 'info-en',
        language: 'en-EN',
        title: 'Interstellar English',
        releaseDate: 1415145600000,
        posterUrl: '',
        backdropUrl: '',
        createdAt: 1790340848056,
        updatedAt: 1790340848056,
      },
    ],
    gameCategories: [
      {
        id: 'category',
        image: null,
        info: [
          { id: 'category-it', name: 'Film', language: 'it-IT' },
          { id: 'category-en', name: 'Movies', language: 'en-EN' },
        ],
      },
    ],
    soundtracks: [
      {
        id: 'soundtrack',
        tracks: [
          {
            id: 'track',
            externalId: 'spotify-id',
            path: 'https://media.oundtrack.com/track.mp3?Expires=123&Signature=a~b__',
            name: 'S.T.A.Y.',
            artist: 'Hans Zimmer',
            languages: ['en-EN'],
          },
        ],
      },
    ],
  };
}
