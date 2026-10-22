import type { HintTypeIcons } from '../../domain/values/hint-type-icons';
import type { Observable } from 'rxjs';
import type { HintModel } from '../../domain/models/hint.model';
import type { SaveHintCommand } from '../commands/save-hint.command';
export interface HintsRepositoryPort {
  getIcons(): Observable<HintTypeIcons>;
  uploadImage(hintId: string, fileKey: string): Observable<number>;
  completeImage(hintId: string, fileKey: string): Observable<HintModel>;
  getByOwner(ownerId: string): Observable<ReadonlyArray<HintModel>>;
  save(command: SaveHintCommand): Observable<HintModel | null>;
}
