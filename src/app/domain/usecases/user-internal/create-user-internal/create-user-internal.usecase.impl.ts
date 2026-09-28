import { Injectable } from '@angular/core';
import { CreateUserInternal } from '../../../models/user-internal/create-user-internal';
import { UserInternalRepository } from '../../../repository/user-internal/user-internal.repository';
import { CreateUserInternalUseCase } from './create-user-internal.usecase';

@Injectable()
export class CreateUserInternalUseCaseImpl extends CreateUserInternalUseCase {

  constructor(private readonly repository: UserInternalRepository) {
    super();
  }
  override execute(user: CreateUserInternal) {
    return this.repository.create(user);
  }
}
