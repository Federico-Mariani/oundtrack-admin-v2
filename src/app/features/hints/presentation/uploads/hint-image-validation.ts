import {
  HINT_IMAGE_MAX_BYTES,
  HintImageContentType,
  isHintImageContentType,
} from '../../domain/values/hint-image-policy';
export async function isHintImageFile(file: File): Promise<boolean> {
  if (!isHintImageContentType(file.type) || !file.size || file.size > HINT_IMAGE_MAX_BYTES)
    return false;
  if (file.type === HintImageContentType.Jpeg && !/\.jpe?g$/i.test(file.name)) return false;
  if (file.type === HintImageContentType.Png && !/\.png$/i.test(file.name)) return false;
  const bytes = await new Promise<Uint8Array>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) resolve(new Uint8Array(reader.result));
      else reject(new Error('Invalid image bytes'));
    };
    reader.onerror = () => {
      reject(new Error('Unable to read image', { cause: reader.error }));
    };
    reader.readAsArrayBuffer(file.slice(0, 8));
  });
  return file.type === HintImageContentType.Jpeg
    ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
    : [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => bytes[index] === byte);
}
