import { isImageFile } from './image-validation';
import { IMAGE_MAX_BYTES } from '@shared/types/uploads/image-policy';
describe('Hint image validation', () => {
  it('accepts JPEG and PNG signatures with matching MIME and extension', async () => {
    expect(
      await isImageFile(
        new File([new Uint8Array([255, 216, 255, 0])], 'actor.JPG', { type: 'image/jpeg' }),
      ),
    ).toBe(true);
    expect(
      await isImageFile(
        new File([new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])], 'frame.png', {
          type: 'image/png',
        }),
      ),
    ).toBe(true);
  });
  it('rejects renamed text, empty files, unsupported formats and MIME mismatches', async () => {
    for (const file of [
      new File(['text'], 'fake.png', { type: 'image/png' }),
      new File([], 'empty.jpg', { type: 'image/jpeg' }),
      new File(['image'], 'frame.gif', { type: 'image/gif' }),
      new File([new Uint8Array([255, 216, 255, 0])], 'actor.png', { type: 'image/png' }),
    ])
      expect(await isImageFile(file)).toBe(false);
  });
  it('rejects images larger than the backend limit', async () => {
    expect(
      await isImageFile(
        new File([new Uint8Array(IMAGE_MAX_BYTES + 1)], 'large.png', { type: 'image/png' }),
      ),
    ).toBe(false);
  });
});
