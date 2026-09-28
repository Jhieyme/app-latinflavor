import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthSession } from '../../../models/auth/auth-session';
import { AuthRepository } from '../../../repository/auth/auth.repository';
import { ValidateCodeUseCase } from './validate-code.usecase';

@Injectable()
export class ValidateCodeUseCaseImpl implements ValidateCodeUseCase {

  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  execute(email: string, code: string): Observable<AuthSession> {
    return this.authRepository.validateCode(email, code);
  }
}
