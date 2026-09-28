import { Injectable } from '@angular/core';
import { UserInternalRepository } from '../../../repository/user-internal/user-internal.repository';
import { DisableUserInternalUseCase } from './disable-user-internal.usecase';

@Injectable()
export class DisableUserInternalUseCaseImpl extends DisableUserInternalUseCase {
  constructor(private readonly repository: UserInternalRepository) {
    super();
  }
  override execute(id: string) {
    return this.repository.disable(id);
  }
}
