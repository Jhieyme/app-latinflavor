import { Observable } from 'rxjs';

export abstract class DisableUserInternalUseCase {
  abstract execute(id: string): Observable<void>;
}
