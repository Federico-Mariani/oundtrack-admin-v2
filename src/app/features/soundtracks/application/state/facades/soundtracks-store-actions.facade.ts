import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import type { SoundtrackTrackModel } from '@shared/types/catalog/soundtrack-track.model';
import type { SaveSoundtrackCommand } from '../../commands/save-soundtrack.command';
import {
  SoundtracksAudioEvents,
  SoundtracksAudioSaveActions,
} from '../actions/soundtracks-audio.actions';
@Injectable({ providedIn: 'root' })
export class SoundtracksStoreActionsFacade {
  private readonly store = inject(Store);
  openAudio(
    sessionId: string,
    soundtrackId: string | null,
    track: SoundtrackTrackModel | null,
  ): void {
    this.store.dispatch(SoundtracksAudioEvents.opened({ sessionId, soundtrackId, track }));
  }
  closeAudio(sessionId: string): void {
    this.store.dispatch(SoundtracksAudioEvents.closed({ sessionId }));
  }
  restartAudioUpload(sessionId: string): void {
    this.store.dispatch(SoundtracksAudioEvents.restartUpload({ sessionId }));
  }
  cancelAudio(sessionId: string): void {
    this.store.dispatch(SoundtracksAudioEvents.cancelled({ sessionId }));
  }
  saveAudio(sessionId: string, input: SaveSoundtrackCommand): void {
    this.store.dispatch(SoundtracksAudioSaveActions.requested({ sessionId, input }));
  }
}
