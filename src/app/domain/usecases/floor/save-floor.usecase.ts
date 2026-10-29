import { Observable } from 'rxjs';
import { FloorKind, FloorInputs } from '../../models/floor/floor';
export abstract class SaveFloorUseCase {
  abstract execute<K extends FloorKind>(kind: K, data: FloorInputs[K], id?: string): Observable<void>;
}
