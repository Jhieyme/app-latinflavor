import { Observable } from 'rxjs';
import { UpdateUserAccess } from '../../../models/user-internal/update-user-access';

export abstract class UpdateUserAccessUseCase {
  abstract execute(id: string, value: UpdateUserAccess): Observable<void>;
}
