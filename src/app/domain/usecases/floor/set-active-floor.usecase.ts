import { Observable } from 'rxjs';
import { FloorKind } from '../../models/floor/floor';
export abstract class SetActiveFloorUseCase {
  abstract execute<K extends FloorKind>(kind: K, id: string, active: boolean): Observable<void>;
}
