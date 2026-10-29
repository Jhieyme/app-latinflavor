import { Observable } from 'rxjs';
import { FloorKind, FloorEntities, FloorInputs, FloorPage, FloorSearch } from '../../models/floor/floor';
export abstract class FloorRepository {
  abstract search<K extends FloorKind>(kind: K, query: FloorSearch): Observable<FloorPage<FloorEntities[K]>>;
  abstract get<K extends FloorKind>(kind: K, id: string): Observable<FloorEntities[K]>;
  abstract create<K extends FloorKind>(kind: K, data: FloorInputs[K]): Observable<void>;
  abstract update<K extends FloorKind>(kind: K, id: string, data: FloorInputs[K]): Observable<void>;
  abstract setActive(kind: FloorKind, id: string, active: boolean): Observable<void>;
}
