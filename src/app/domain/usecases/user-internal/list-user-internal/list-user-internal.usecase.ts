import { Observable } from 'rxjs';
import { UserInternal } from '../../../models/user-internal/user-internal';

export abstract class ListUserInternalUseCase {
  abstract execute(): Observable<readonly UserInternal[]>;
}
