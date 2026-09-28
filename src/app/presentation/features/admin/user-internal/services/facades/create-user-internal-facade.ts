import { Injectable } from '@angular/core';
import { CreateUserInternal } from '../../../../../../domain/models/user-internal/create-user-internal';
import { CreateUserInternalUseCase } from '../../../../../../domain/usecases/user-internal/create-user-internal/create-user-internal.usecase';

@Injectable()
export class CreateUserInternalFacade {
  constructor(private readonly useCase: CreateUserInternalUseCase) {}
  execute(user: CreateUserInternal) {
    return this.useCase.execute(user);
  }
}
