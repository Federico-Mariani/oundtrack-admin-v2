import { TestBed } from '@angular/core/testing';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { SoundtrackFileSelection } from './soundtrack-file-selection';

const mp3Header = new Uint8Array([0x49, 0x44, 0x33]).buffer;

function audioFile(
  name: string,
  readBytes: () => Promise<ArrayBuffer> = () => Promise.resolve(mp3Header),
): File {
  const file = new File(['ID3'], name);
  const header = file.slice();
  Object.defineProperty(header, 'arrayBuffer', { value: readBytes });
  vi.spyOn(file, 'slice').mockReturnValue(header);
  return file;
}

describe('Soundtrack file selection lifecycle', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    TestBed.configureTestingModule({ providers: [SoundtrackFileSelection] });
  });

  it('releases the previous file when replaced and releases the final file on destruction', async () => {
    const selection = TestBed.inject(SoundtrackFileSelection);
    const files = TestBed.inject(UploadFiles);
    const release = vi.spyOn(files, 'release');
    await selection.choose(audioFile('first.mp3'));
    const firstKey = selection.fileKey;
    await selection.choose(audioFile('second.mp3'));
    expect(release).toHaveBeenCalledWith(firstKey);
    expect(selection.fileName()).toBe('second.mp3');
    const secondKey = selection.fileKey;
    TestBed.resetTestingModule();
    expect(release).toHaveBeenCalledWith(secondKey);
    expect(selection.fileKey).toBeNull();
  });

  it('does not register a file after its pending validation has been cancelled', async () => {
    let finishValidation: (bytes: ArrayBuffer) => void = () => undefined;
    const file = audioFile(
      'pending.mp3',
      () =>
        new Promise<ArrayBuffer>((resolve) => {
          finishValidation = resolve;
        }),
    );
    const selection = TestBed.inject(SoundtrackFileSelection);
    const register = vi.spyOn(TestBed.inject(UploadFiles), 'register');
    const pending = selection.choose(file);
    expect(selection.checkingFile()).toBe(true);
    selection.remove();
    finishValidation(mp3Header);
    await pending;
    expect(register).not.toHaveBeenCalled();
    expect(selection.fileName()).toBe('');
    expect(selection.checkingFile()).toBe(false);
  });
});
