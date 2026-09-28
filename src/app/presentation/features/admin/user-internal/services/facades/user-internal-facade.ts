import { GetUserInternalUseCase } from '../../../../../../domain/usecases/user-internal/get-user-internal/get-user-internal.usecase';
import { Injectable } from '@angular/core';
import { ListUserInternalUseCase } from '../../../../../../domain/usecases/user-internal/list-user-internal/list-user-internal.usecase';

@Injectable()
export class UserInternalFacade {
  constructor(
    private readonly listUsers: ListUserInternalUseCase,
    private readonly getUser: GetUserInternalUseCase,
  ) {}
  detail(id: string) {
    return this.getUser.execute(id);
  }
  execute() {
    return this.listUsers.execute();
  }
}
