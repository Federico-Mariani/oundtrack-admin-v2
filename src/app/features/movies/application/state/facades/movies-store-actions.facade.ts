import type { MovieSoundtrackTrackModel } from '../../../domain/models/movie-soundtrack-track.model';
import type { MovieAudioInputModel } from '../../../domain/models/movie-audio-input.model';
import { MoviesAudioEvents, MoviesAudioSaveActions } from '../actions/movies-audio.actions';
import type { CreateMovieInfoModel } from '../../../domain/models/create-movie-info.model';
import { MoviesInfoCreateActions } from '../actions/movies-info-create.actions';
import type { Id } from '@shared/types/id';
import { MoviesDetailActions } from '../actions/movies-detail.actions';
import type { CreateMovieModel } from '../../../domain/models/create-movie.model';
import { MoviesCreateActions } from '../actions/movies-create.actions';
import type { MoviesListQuery } from '../../../domain/models/movies-list-query.model';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MoviesGetAllActions } from '../actions/movies-get-all.actions';

@Injectable({ providedIn: 'root' })
export class MoviesStoreActionsFacade {
  private readonly store = inject(Store);

  openAudio(
    sessionId: string,
    soundtrackId: string | null,
    track: MovieSoundtrackTrackModel | null,
  ): void {
    this.store.dispatch(MoviesAudioEvents.opened({ sessionId, soundtrackId, track }));
  }
  closeAudio(sessionId: string): void {
    this.store.dispatch(MoviesAudioEvents.closed({ sessionId }));
  }
  restartAudioUpload(sessionId: string): void {
    this.store.dispatch(MoviesAudioEvents.restartUpload({ sessionId }));
  }
  cancelAudio(sessionId: string): void {
    this.store.dispatch(MoviesAudioEvents.cancelled({ sessionId }));
  }
  saveAudio(sessionId: string, input: MovieAudioInputModel): void {
    this.store.dispatch(MoviesAudioSaveActions.requested({ sessionId, input }));
  }
  createInfo(request: CreateMovieInfoModel): void {
    this.store.dispatch(MoviesInfoCreateActions.requested({ request }));
  }
  resetCreateInfo(): void {
    this.store.dispatch(MoviesInfoCreateActions.reset());
  }
  loadDetail(id: Id): void {
    this.store.dispatch(MoviesDetailActions.requested({ id }));
  }
  closeDetail(id: Id): void {
    this.store.dispatch(MoviesDetailActions.closed({ id }));
  }
  createMovie(movie: CreateMovieModel): void {
    this.store.dispatch(MoviesCreateActions.requested({ movie }));
  }
  resetCreateMovie(): void {
    this.store.dispatch(MoviesCreateActions.reset());
  }
  loadMovies(query: MoviesListQuery, debounce = false): void {
    this.store.dispatch(MoviesGetAllActions.requested({ query, debounce }));
  }
}
