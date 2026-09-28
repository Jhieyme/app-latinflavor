import { Observable } from 'rxjs';
import { UpdateUserInternal } from '../../models/user-internal/update-user-internal';
import { UpdateUserAccess } from '../../models/user-internal/update-user-access';
import { CreateUserInternal } from '../../models/user-internal/create-user-internal';
import { UserInternal } from '../../models/user-internal/user-internal';

export abstract class UserInternalRepository {
  abstract updateInfo(id: string, value: UpdateUserInternal): Observable<void>;
  abstract updateAccess(id: string, value: UpdateUserAccess): Observable<void>;
  abstract disable(id: string): Observable<void>;
  abstract create(user: CreateUserInternal): Observable<void>;
  abstract getById(id: string): Observable<UserInternal>;
  abstract getAll(): Observable<readonly UserInternal[]>;
}
