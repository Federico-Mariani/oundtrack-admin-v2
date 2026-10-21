import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { soundtracksFeature } from '../soundtracks.feature';

@Injectable({ providedIn: 'root' })
export class SoundtracksStoreDataFacade {
  private readonly store = inject(Store);

  readonly audio = this.store.selectSignal(soundtracksFeature.selectAudio);
}
