import { createTranslationLoader } from './translation-loader';
describe('Translation scope preloading', () => {
  it('shares an in-flight load with the scope directive without mixing languages', async () => {
    const en = vi.fn().mockResolvedValue({ default: { title: 'Title' } }),
      it = vi.fn().mockResolvedValue({ default: { title: 'Titolo' } });
    const loader = createTranslationLoader({ en: { detail: en }, it: { detail: it } });
    const prefetch = loader.en();
    expect(loader.en()).toBe(prefetch);
    expect(await prefetch).toEqual({ detail: { title: 'Title' } });
    expect(en).toHaveBeenCalledOnce();
    expect(await loader.it()).toEqual({ detail: { title: 'Titolo' } });
    expect(it).toHaveBeenCalledOnce();
  });
  it('allows retry after a failed preload', async () => {
    const read = vi
      .fn()
      .mockRejectedValueOnce(new Error('Offline'))
      .mockResolvedValue({ default: { title: 'Loaded' } });
    const loader = createTranslationLoader({ en: { detail: read }, it: { detail: read } });
    await expect(loader.en()).rejects.toThrow('Offline');
    expect(await loader.en()).toEqual({ detail: { title: 'Loaded' } });
    expect(read).toHaveBeenCalledTimes(2);
  });
});
