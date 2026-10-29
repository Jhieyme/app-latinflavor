import { Observable } from 'rxjs';
import { FloorKind, FloorSearch, FloorPage, FloorEntities } from '../../models/floor/floor';
export abstract class SearchFloorUseCase {
  abstract execute<K extends FloorKind>(kind: K, query: FloorSearch): Observable<FloorPage<FloorEntities[K]>>;
}
