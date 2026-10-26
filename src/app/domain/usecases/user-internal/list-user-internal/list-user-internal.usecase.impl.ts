import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchUserInternal, UserInternalPageResult } from '../../../models/user-internal/search-user-internal';
import { UserInternalRepository } from '../../../repository/user-internal/user-internal.repository';
import { ListUserInternalUseCase } from './list-user-internal.usecase';

@Injectable()
export class ListUserInternalUseCaseImpl extends ListUserInternalUseCase {
  constructor(private readonly repository: UserInternalRepository) { super(); }
  override execute(criteria: SearchUserInternal): Observable<UserInternalPageResult> { return this.repository.search(criteria); }
}
