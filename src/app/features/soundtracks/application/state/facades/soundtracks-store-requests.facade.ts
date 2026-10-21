import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { createRequestSignals } from '@shared/state/request-signals';
import { soundtracksFeature } from '../soundtracks.feature';

@Injectable({ providedIn: 'root' })
export class SoundtracksStoreRequestsFacade {
  private readonly store = inject(Store);

  readonly audio = createRequestSignals(
    this.store.selectSignal(soundtracksFeature.selectAudioRequest),
  );
}
