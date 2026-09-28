import { Injectable } from '@angular/core';
import { UpdateUserInternal } from '../../../../../../domain/models/user-internal/update-user-internal';
import { UpdateUserAccess } from '../../../../../../domain/models/user-internal/update-user-access';
import { UpdateUserInternalUseCase } from '../../../../../../domain/usecases/user-internal/update-user-internal/update-user-internal.usecase';
import { UpdateUserAccessUseCase } from '../../../../../../domain/usecases/user-internal/update-user-access/update-user-access.usecase';

@Injectable()
export class UpdateUserInternalFacade {
  constructor(
    private readonly info: UpdateUserInternalUseCase,
    private readonly access: UpdateUserAccessUseCase,
  ) {}
  updateInfo(id: string, value: UpdateUserInternal) {
    return this.info.execute(id, value);
  }
  updateAccess(id: string, value: UpdateUserAccess) {
    return this.access.execute(id, value);
  }
}
