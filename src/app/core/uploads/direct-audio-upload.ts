import { XhrFactory } from '@angular/common';
import { HttpClient, HttpEventType, HttpXhrBackend } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { filter, map, type Observable } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class DirectAudioUpload {
  private readonly http = new HttpClient(new HttpXhrBackend(inject(XhrFactory)));
  put(url: string, headers: Readonly<Record<string, string>>, file: File): Observable<number> {
    return this.http
      .put(url, file, { headers, observe: 'events', reportProgress: true, responseType: 'text' })
      .pipe(
        filter(
          (event) =>
            event.type === HttpEventType.UploadProgress || event.type === HttpEventType.Response,
        ),
        map((event) =>
          event.type === HttpEventType.Response
            ? 100
            : Math.min(99, Math.round((event.loaded / (event.total ?? file.size)) * 100)),
        ),
      );
  }
}
