import { Provider } from '@angular/core';
import { AuthRepository } from '../../../domain/repository/auth/auth.repository';
import { AuthRepositoryImpl } from '../../../data/services/auth/auth.repository.impl';
import { LOGIN_USECASES } from '../../../domain/usecases/auth/provider';
import { LoginFacade } from './login/services/facades/login-facade';

export function provideAdminFeature(): Provider[] {
  return [
    LoginFacade,
    ...LOGIN_USECASES,
    { provide: AuthRepository, useClass: AuthRepositoryImpl },
  ];
}
