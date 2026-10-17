import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class UploadFiles {
  private readonly files = new Map<string, File>();
  register(file: File): string {
    const key = crypto.randomUUID();
    this.files.set(key, file);
    return key;
  }
  get(key: string): File | undefined {
    return this.files.get(key);
  }
  release(key: string): void {
    this.files.delete(key);
  }
}
