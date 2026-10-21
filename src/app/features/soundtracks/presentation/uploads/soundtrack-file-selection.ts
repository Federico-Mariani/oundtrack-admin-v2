import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { UploadFiles } from '@app/core/uploads/upload-files';
import { isMp3File } from '@app/core/uploads/mp3-file-validation';
@Injectable()
export class SoundtrackFileSelection {
  private readonly files = inject(UploadFiles);
  private readonly destroyRef = inject(DestroyRef);
  private selectionGeneration = 0;
  fileKey: string | null = null;
  readonly fileName = signal('');
  readonly fileSize = signal('');
  readonly fileInvalid = signal(false);
  readonly checkingFile = signal(false);
  readonly multipleFiles = signal(false);
  constructor() {
    this.destroyRef.onDestroy(() => {
      this.remove();
    });
  }
  remove(): void {
    this.selectionGeneration++;
    if (this.fileKey) {
      this.files.release(this.fileKey);
      this.fileKey = null;
    }
    this.fileName.set('');
    this.fileSize.set('');
    this.fileInvalid.set(false);
    this.multipleFiles.set(false);
    this.checkingFile.set(false);
  }
  async choose(file: File): Promise<void> {
    if (this.checkingFile()) {
      return;
    }
    this.multipleFiles.set(false);
    const generation = ++this.selectionGeneration;
    if (this.fileKey) {
      this.files.release(this.fileKey);
      this.fileKey = null;
    }
    this.fileName.set('');
    this.fileInvalid.set(false);
    this.checkingFile.set(true);
    let valid: boolean;
    try {
      valid = await isMp3File(file);
    } catch {
      valid = false;
    }
    if (generation !== this.selectionGeneration || this.destroyRef.destroyed) {
      return;
    }
    this.checkingFile.set(false);
    this.fileInvalid.set(!valid);
    if (valid) {
      this.fileKey = this.files.register(file);
      this.fileName.set(file.name);
      this.fileSize.set((file.size / 1024 / 1024).toFixed(2));
    }
  }
}
