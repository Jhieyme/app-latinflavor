import { Injectable } from '@angular/core';
import { UserInternalRepository } from '../../../repository/user-internal/user-internal.repository';
import { GetUserInternalUseCase } from './get-user-internal.usecase';

@Injectable()
export class GetUserInternalUseCaseImpl extends GetUserInternalUseCase {
  constructor(private readonly repository: UserInternalRepository) { super(); }
  override execute(id: string) { return this.repository.getById(id); }
}
