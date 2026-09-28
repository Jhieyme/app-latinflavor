import { Observable } from 'rxjs';
import { UpdateUserInternal } from '../../../models/user-internal/update-user-internal';

export abstract class UpdateUserInternalUseCase {
  abstract execute(id: string, value: UpdateUserInternal): Observable<void>;
}
