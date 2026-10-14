export function toMovieImageUrl(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  const normalized = value
    .trim()
    .replace(/^https?:\/\/(?:www\.)?themoviedb\.org\/t\/p\/(?:w\d+|original)(?=https?:\/\/)/, '');
  try {
    const url = new URL(normalized);
    return url.protocol === 'https:' || url.protocol === 'http:' ? normalized : '';
  } catch {
    return '';
  }
}
