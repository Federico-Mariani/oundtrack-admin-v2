import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { isImageFile } from './image-validation';
@Injectable()
export class ImageSelection {
  private readonly files = inject(UploadFiles);
  private readonly destroyRef = inject(DestroyRef);
  private generation = 0;
  private pendingPreview: string | null = null;
  readonly fileKey = signal<string | null>(null);
  readonly name = signal('');
  readonly size = signal('');
  readonly preview = signal<string | null>(null);
  readonly checking = signal(false);
  readonly invalid = signal(false);
  readonly multiple = signal(false);
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.remove();
    });
  }
  remove(): void {
    this.generation++;
    if (this.pendingPreview) URL.revokeObjectURL(this.pendingPreview);
    this.pendingPreview = null;
    const key = this.fileKey(),
      preview = this.preview();
    if (key) this.files.release(key);
    if (preview) URL.revokeObjectURL(preview);
    this.fileKey.set(null);
    this.preview.set(null);
    this.name.set('');
    this.size.set('');
    this.invalid.set(false);
    this.multiple.set(false);
    this.checking.set(false);
  }
  private isCurrent(generation: number): boolean {
    return !this.destroyRef.destroyed && generation === this.generation;
  }
  async choose(file: File): Promise<void> {
    this.remove();
    const generation = this.generation;
    this.checking.set(true);
    let preview: string | null = null;
    try {
      if (!(await isImageFile(file))) throw new Error('Invalid image');
      if (!this.isCurrent(generation)) return;
      preview = URL.createObjectURL(file);
      this.pendingPreview = preview;
      const url = preview;
      await new Promise<void>((resolve, reject) => {
        const image = new Image();
        image.onload = () => {
          if (image.naturalWidth > 0 && image.naturalHeight > 0) resolve();
          else reject(new Error('Empty image'));
        };
        image.onerror = () => {
          reject(new Error('Invalid image'));
        };
        image.src = url;
      });
      if (!this.isCurrent(generation)) {
        URL.revokeObjectURL(preview);
        return;
      }
      this.pendingPreview = null;
      this.fileKey.set(this.files.register(file));
      this.preview.set(preview);
      this.name.set(file.name);
      this.size.set((file.size / 1024 / 1024).toFixed(2));
    } catch {
      if (this.pendingPreview === preview) this.pendingPreview = null;
      if (preview) URL.revokeObjectURL(preview);
      if (this.isCurrent(generation)) this.invalid.set(true);
    } finally {
      if (this.isCurrent(generation)) this.checking.set(false);
    }
  }
}
