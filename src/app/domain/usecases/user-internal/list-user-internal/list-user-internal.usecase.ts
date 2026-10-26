import { Observable } from 'rxjs';
import { SearchUserInternal, UserInternalPageResult } from '../../../models/user-internal/search-user-internal';

export abstract class ListUserInternalUseCase {
  abstract execute(criteria: SearchUserInternal): Observable<UserInternalPageResult>;
}
