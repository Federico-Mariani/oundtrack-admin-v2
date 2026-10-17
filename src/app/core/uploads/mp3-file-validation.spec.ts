import { isMp3File } from './mp3-file-validation';
describe('MP3 file validation', () => {
  it('accepts ID3 and MPEG frame headers, but rejects renamed text, empty files and other extensions', async () => {
    expect(await isMp3File(new File(['ID3audio'], 'track.MP3'))).toBe(true);
    expect(await isMp3File(new File([new Uint8Array([0xff, 0xfb, 0x90, 0x64])], 'track.mp3'))).toBe(
      true,
    );
    expect(await isMp3File(new File(['plain text'], 'track.mp3'))).toBe(false);
    expect(await isMp3File(new File([], 'track.mp3'))).toBe(false);
    expect(await isMp3File(new File(['ID3audio'], 'track.wav'))).toBe(false);
  });
});
