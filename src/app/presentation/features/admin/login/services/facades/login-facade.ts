import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthSession } from '../../../../../../domain/models/auth/auth-session';
import { LoginUseCase } from '../../../../../../domain/usecases/auth/login/login.usecase';

@Injectable()
export class LoginFacade {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  execute(username: string, password: string): Observable<AuthSession> {
    return this.loginUseCase.execute(username, password);
  }
}
