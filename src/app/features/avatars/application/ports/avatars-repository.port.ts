import type { Observable } from 'rxjs';
import type { AvatarModel } from '../../domain/models/avatar.model';
export interface AvatarsRepositoryPort {
  getAll(): Observable<ReadonlyArray<AvatarModel>>;
  upload(fileKey: string): Observable<{ progress: number; key: string }>;
  complete(fileKey: string, key: string, avatarId?: string): Observable<AvatarModel>;
}
