import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginOtpUseCase } from '../../../../../../domain/usecases/auth/login-otp/login-otp.usecase';

@Injectable()
export class LoginOtpFacade {

  constructor(
    private readonly loginOtpUseCase: LoginOtpUseCase
  ) {}

  execute(email: string): Observable<void> {
    return this.loginOtpUseCase.execute(email);
  }

}
