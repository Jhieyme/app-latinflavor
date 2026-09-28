import { Injectable } from "@angular/core";
import { LoginOtpUseCase } from "./login-otp.usecase";
import { AuthRepository } from "../../../repository/auth/auth.repository";
import { Observable } from "rxjs";

@Injectable()
export class LoginOtpUseCaseImpl implements LoginOtpUseCase {

  constructor(
    private readonly authRepository: AuthRepository) {
  }

  execute(email: string): Observable<void> {
    return this.authRepository.generateCode(email);
  }

}
