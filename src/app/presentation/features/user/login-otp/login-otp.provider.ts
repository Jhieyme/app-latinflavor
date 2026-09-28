import { Provider } from "@angular/core";
import { AuthRepository } from "../../../../domain/repository/auth/auth.repository";
import { AuthRepositoryImpl } from "../../../../data/services/auth/auth.repository.impl";
import { LOGIN_OTP_USECASES } from "../../../../domain/usecases/auth/provider";
import { LoginOtpFacade } from "./services/facades/login-otp-facade";
import { ValidateCodeFacade } from './services/facades/validate-code-facade';

export const provideLoginOtpFeature = (): Provider[] =>
([
  LoginOtpFacade,
  ValidateCodeFacade,
  ...LOGIN_OTP_USECASES,
  {
    provide: AuthRepository,
    useClass: AuthRepositoryImpl
  },
]);
