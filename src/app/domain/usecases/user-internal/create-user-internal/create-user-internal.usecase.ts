import { Observable } from 'rxjs';
import { CreateUserInternal } from '../../../models/user-internal/create-user-internal';

export abstract class CreateUserInternalUseCase {
  abstract execute(user: CreateUserInternal): Observable<void>;
}
