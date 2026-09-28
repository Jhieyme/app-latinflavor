import { GetUserInternalUseCase } from './get-user-internal/get-user-internal.usecase';
import { GetUserInternalUseCaseImpl } from './get-user-internal/get-user-internal.usecase.impl';
import { Provider } from '@angular/core';
import { UpdateUserInternalUseCase } from './update-user-internal/update-user-internal.usecase';
import { UpdateUserInternalUseCaseImpl } from './update-user-internal/update-user-internal.usecase.impl';
import { UpdateUserAccessUseCase } from './update-user-access/update-user-access.usecase';
import { UpdateUserAccessUseCaseImpl } from './update-user-access/update-user-access.usecase.impl';
import { DisableUserInternalUseCase } from './disable-user-internal/disable-user-internal.usecase';
import { DisableUserInternalUseCaseImpl } from './disable-user-internal/disable-user-internal.usecase.impl';
import { CreateUserInternalUseCase } from './create-user-internal/create-user-internal.usecase';
import { CreateUserInternalUseCaseImpl } from './create-user-internal/create-user-internal.usecase.impl';
import { ListUserInternalUseCase } from './list-user-internal/list-user-internal.usecase';
import { ListUserInternalUseCaseImpl } from './list-user-internal/list-user-internal.usecase.impl';

export const USER_INTERNAL_USECASES: Provider[] = [
  {
    provide: GetUserInternalUseCase,
    useClass: GetUserInternalUseCaseImpl
  },
  {
    provide: UpdateUserInternalUseCase,
    useClass: UpdateUserInternalUseCaseImpl },
  {
    provide: UpdateUserAccessUseCase,
    useClass: UpdateUserAccessUseCaseImpl },
  {
    provide: DisableUserInternalUseCase,
    useClass: DisableUserInternalUseCaseImpl },
  {
    provide: CreateUserInternalUseCase,
    useClass: CreateUserInternalUseCaseImpl },
  {
    provide: ListUserInternalUseCase,
    useClass: ListUserInternalUseCaseImpl,
  },
];
