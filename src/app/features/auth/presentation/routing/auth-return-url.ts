export function resolveAuthReturnUrl(requestedUrl: string | null): string | null {
  if (!requestedUrl || !requestedUrl.startsWith('/') || requestedUrl.startsWith('//')) {
    return null;
  }

  return requestedUrl;
}
