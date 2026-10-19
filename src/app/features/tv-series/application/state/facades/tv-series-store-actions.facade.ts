import type { Id } from '@shared/types/id';
import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { TvSeriesSoundtrackTrackModel } from '../../../domain/models/tv-series-soundtrack-track.model';
import { TvSeriesAudioEvents, TvSeriesAudioSaveActions } from '../actions/tv-series-audio.actions';
import { TvSeriesInfoCreateActions } from '../actions/tv-series-info-create.actions';
import { TvSeriesDetailActions } from '../actions/tv-series-detail.actions';
import { TvSeriesCreateActions } from '../actions/tv-series-create.actions';
import { TvSeriesGetAllActions } from '../actions/tv-series-get-all.actions';
import type { CreateTvSeriesModel } from '../../../domain/models/create-tv-series.model';
import type { TvSeriesListQuery } from '../../../domain/models/tv-series-list-query.model';
import type { CreateTvSeriesInfoModel } from '../../../domain/models/create-tv-series-info.model';
import type { TvSeriesAudioInputModel } from '../../../domain/models/tv-series-audio-input.model';

@Injectable({ providedIn: 'root' })
export class TvSeriesStoreActionsFacade {
  private readonly store = inject(Store);

  openAudio(
    sessionId: string,
    soundtrackId: string | null,
    track: TvSeriesSoundtrackTrackModel | null,
  ): void {
    this.store.dispatch(TvSeriesAudioEvents.opened({ sessionId, soundtrackId, track }));
  }
  closeAudio(sessionId: string): void {
    this.store.dispatch(TvSeriesAudioEvents.closed({ sessionId }));
  }
  restartAudioUpload(sessionId: string): void {
    this.store.dispatch(TvSeriesAudioEvents.restartUpload({ sessionId }));
  }
  cancelAudio(sessionId: string): void {
    this.store.dispatch(TvSeriesAudioEvents.cancelled({ sessionId }));
  }
  saveAudio(sessionId: string, input: TvSeriesAudioInputModel): void {
    this.store.dispatch(TvSeriesAudioSaveActions.requested({ sessionId, input }));
  }
  createInfo(request: CreateTvSeriesInfoModel): void {
    this.store.dispatch(TvSeriesInfoCreateActions.requested({ request }));
  }
  resetCreateInfo(): void {
    this.store.dispatch(TvSeriesInfoCreateActions.reset());
  }
  loadDetail(id: Id): void {
    this.store.dispatch(TvSeriesDetailActions.requested({ id }));
  }
  closeDetail(id: Id): void {
    this.store.dispatch(TvSeriesDetailActions.closed({ id }));
  }
  createTvSeries(tvSeries: CreateTvSeriesModel): void {
    this.store.dispatch(TvSeriesCreateActions.requested({ tvSeries }));
  }
  resetCreateTvSeries(): void {
    this.store.dispatch(TvSeriesCreateActions.reset());
  }
  getAllTvSeries(query: TvSeriesListQuery, debounce = false): void {
    this.store.dispatch(TvSeriesGetAllActions.requested({ query, debounce }));
  }
}
