import { Injectable } from '@angular/core';
import { DisableUserInternalUseCase } from '../../../../../../domain/usecases/user-internal/disable-user-internal/disable-user-internal.usecase';

@Injectable()
export class DisableUserInternalFacade {
  constructor(private readonly useCase: DisableUserInternalUseCase) {}
  execute(id: string) {
    return this.useCase.execute(id);
  }
}
