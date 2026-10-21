import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideTransloco } from '@jsverse/transloco';
import { BrnSlider } from '@spartan-ng/brain/slider';
import { of } from 'rxjs';
import { SoundtrackPlayer } from './soundtrack-player';

class EmptyTranslationLoader {
  getTranslation() {
    return of({});
  }
}

describe('Soundtrack player seeking', () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => undefined);
    TestBed.configureTestingModule({
      providers: [
        provideTransloco({
          config: { availableLangs: ['en', 'it'], defaultLang: 'en', prodMode: true },
          loader: EmptyTranslationLoader,
        }),
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.restoreAllMocks();
  });

  async function createPlayer() {
    const fixture = TestBed.createComponent(SoundtrackPlayer);
    fixture.componentRef.setInput('soundtrackId', 'soundtrack');
    fixture.componentRef.setInput('track', {
      id: 'track',
      externalId: 'external',
      name: 'Track',
      artist: 'Artist',
      path: 'https://media.example.test/track.mp3',
      languages: ['en-US'],
    });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    await vi.waitFor(() => {
      fixture.detectChanges();
      expect(element.querySelector('audio')).not.toBeNull();
    });
    const audio = element.querySelector('audio');
    if (!audio) {
      throw new Error('Expected the player audio element');
    }
    Object.defineProperty(audio, 'duration', { value: 120, configurable: true });
    audio.currentTime = 10;
    audio.dispatchEvent(new Event('loadedmetadata'));
    fixture.detectChanges();
    const slider = fixture.debugElement.query(By.directive(BrnSlider)).injector.get(BrnSlider);
    return { fixture, audio, slider, element };
  }

  it('seeks the audio on valueChange and retains the selected position after timeupdate', async () => {
    const { fixture, audio, slider } = await createPlayer();
    slider.valueChange.emit([65]);
    expect(audio.currentTime).toBe(65);
    audio.dispatchEvent(new Event('timeupdate'));
    fixture.detectChanges();
    expect(slider.value()).toEqual([65]);
    slider.valueChange.emit([25]);
    audio.dispatchEvent(new Event('timeupdate'));
    fixture.detectChanges();
    expect(audio.currentTime).toBe(25);
    expect(slider.value()).toEqual([25]);
  });

  it('supports keyboard seeking through the Spartan thumb', async () => {
    const { fixture, audio, element } = await createPlayer();
    const thumb = element.querySelector('[role="slider"]');
    if (!thumb) {
      throw new Error('Expected the accessible slider thumb');
    }
    thumb.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(audio.currentTime).toBeCloseTo(10.1);
  });

  it('clamps positions and ignores empty or invalid values', async () => {
    const { audio, slider } = await createPlayer();
    slider.valueChange.emit([999]);
    expect(audio.currentTime).toBe(120);
    slider.valueChange.emit([-5]);
    expect(audio.currentTime).toBe(0);
    slider.valueChange.emit([]);
    slider.valueChange.emit([Number.NaN]);
    expect(audio.currentTime).toBe(0);
  });
});
