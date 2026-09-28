import { Observable } from 'rxjs';
import { UserInternal } from '../../../models/user-internal/user-internal';

export abstract class GetUserInternalUseCase {
  abstract execute(id: string): Observable<UserInternal>;
}
