import { Injectable } from '@angular/core';
import { UpdateUserAccess } from '../../../models/user-internal/update-user-access';
import { UserInternalRepository } from '../../../repository/user-internal/user-internal.repository';
import { UpdateUserAccessUseCase } from './update-user-access.usecase';

@Injectable()
export class UpdateUserAccessUseCaseImpl extends UpdateUserAccessUseCase {
  constructor(private readonly repository: UserInternalRepository) {
    super();
  }
  override execute(id: string, value: UpdateUserAccess) {
    return this.repository.updateAccess(id, value);
  }
}
