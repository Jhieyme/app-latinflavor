import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthSession } from '../../../models/auth/auth-session';
import { AuthRepository } from '../../../repository/auth/auth.repository';
import { LoginUseCase } from './login.usecase';

@Injectable()
export class LoginUseCaseImpl extends LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {
    super();
  }

  override execute(username: string, password: string): Observable<AuthSession> {
    return this.authRepository.signIn(username, password);
  }
}
