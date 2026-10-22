import { TestBed } from '@angular/core/testing';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { HintImageSelection } from './hint-image-selection';
class DecodableImage {
  naturalWidth = 100;
  naturalHeight = 100;
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  set src(_value: string) {
    queueMicrotask(() => this.onload?.());
  }
}
describe('Hint image selection lifecycle', () => {
  const revoke = vi.fn();
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('Image', DecodableImage);
    vi.stubGlobal(
      'URL',
      Object.assign(class extends URL {}, {
        createObjectURL: vi.fn(() => 'blob:preview'),
        revokeObjectURL: revoke,
      }),
    );
    TestBed.configureTestingModule({ providers: [HintImageSelection] });
  });
  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });
  function png() {
    return new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'hint.png', {
      type: 'image/png',
    });
  }
  it('registers the decoded file, replaces it and releases resources on removal', async () => {
    const selection = TestBed.inject(HintImageSelection),
      files = TestBed.inject(UploadFiles),
      file = png();
    await selection.choose(file);
    const first = selection.fileKey()!;
    expect(files.get(first)).toBe(file);
    expect(selection.preview()).toBe('blob:preview');
    await selection.choose(png());
    expect(files.get(first)).toBeUndefined();
    const second = selection.fileKey()!;
    expect(second).not.toBe(first);
    selection.remove();
    expect(files.get(second)).toBeUndefined();
    expect(revoke).toHaveBeenCalled();
  });
  it('rejects an image the browser cannot decode', async () => {
    class BrokenImage extends DecodableImage {
      override set src(_value: string) {
        queueMicrotask(() => this.onerror?.());
      }
    }
    vi.stubGlobal('Image', BrokenImage);
    const selection = TestBed.inject(HintImageSelection);
    await selection.choose(png());
    expect(selection.invalid()).toBe(true);
    expect(selection.fileKey()).toBeNull();
    expect(revoke).toHaveBeenCalledWith('blob:preview');
  });
  it('does not register a late selection after its owner is destroyed', async () => {
    const selection = TestBed.inject(HintImageSelection);
    const choosing = selection.choose(png());
    TestBed.resetTestingModule();
    await choosing;
    expect(selection.fileKey()).toBeNull();
  });
});
