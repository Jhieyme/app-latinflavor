import { Injectable } from '@angular/core';
import { UpdateUserInternal } from '../../../models/user-internal/update-user-internal';
import { UserInternalRepository } from '../../../repository/user-internal/user-internal.repository';
import { UpdateUserInternalUseCase } from './update-user-internal.usecase';

@Injectable()
export class UpdateUserInternalUseCaseImpl extends UpdateUserInternalUseCase {

  constructor(private readonly repository: UserInternalRepository) {
    super();
  }
  override execute(id: string, value: UpdateUserInternal) {
    return this.repository.updateInfo(id, value);
  }
}
