import { Observable } from 'rxjs';
import { FloorKind, FloorEntities } from '../../models/floor/floor';
export abstract class GetFloorUseCase {
  abstract execute<K extends FloorKind>(kind: K, id: string): Observable<FloorEntities[K]>;
}
