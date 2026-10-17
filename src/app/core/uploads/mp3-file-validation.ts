export async function isMp3File(file: File): Promise<boolean> {
  if (!/\.mp3$/i.test(file.name) || file.size < 3) {
    return false;
  }
  const bytes = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
  return (
    (bytes[0] === 0x49 && bytes[1] === 0x44 && bytes[2] === 0x33) ||
    (bytes[0] === 0xff && (bytes[1] & 0xe0) === 0xe0 && (bytes[1] & 0x06) !== 0)
  );
}
