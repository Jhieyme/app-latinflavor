import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserInternal } from '../../../models/user-internal/user-internal';
import { UserInternalRepository } from '../../../repository/user-internal/user-internal.repository';
import { ListUserInternalUseCase } from './list-user-internal.usecase';

@Injectable()
export class ListUserInternalUseCaseImpl extends ListUserInternalUseCase {
  constructor(private readonly repository: UserInternalRepository) { super(); }
  override execute(): Observable<readonly UserInternal[]> { return this.repository.getAll(); }
}
