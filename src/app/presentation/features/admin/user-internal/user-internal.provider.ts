import { Provider } from '@angular/core';
import { UpdateUserInternalFacade } from './services/facades/update-user-internal-facade';
import { DisableUserInternalFacade } from './services/facades/disable-user-internal-facade';
import { CreateUserInternalFacade } from './services/facades/create-user-internal-facade';
import { UserInternalRepository } from '../../../../domain/repository/user-internal/user-internal.repository';
import { UserInternalRepositoryImpl } from '../../../../data/services/user-internal/user-internal.repository.impl';
import { USER_INTERNAL_USECASES } from '../../../../domain/usecases/user-internal/provider';
import { UserInternalFacade } from './services/facades/user-internal-facade';

export function provideUserInternalFeature(): Provider[] {
  return [
    UpdateUserInternalFacade,
    DisableUserInternalFacade,
    CreateUserInternalFacade,
    UserInternalFacade,
    ...USER_INTERNAL_USECASES,
    { provide: UserInternalRepository,
      useClass: UserInternalRepositoryImpl
    }];
}
