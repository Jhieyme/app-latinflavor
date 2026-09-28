import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthSession } from '../../../../../../domain/models/auth/auth-session';
import { ValidateCodeUseCase } from '../../../../../../domain/usecases/auth/validate-code/validate-code.usecase';

@Injectable()
export class ValidateCodeFacade {
  constructor(
    private readonly validateCodeUseCase: ValidateCodeUseCase
  ) { }

  execute(email: string, code: string): Observable<AuthSession> {
    return this.validateCodeUseCase.execute(email, code);
  }
}
