import { Provider } from "@angular/core";
import { LoginUseCase } from './login/login.usecase';
import { LoginUseCaseImpl } from './login/login.usecase.impl';

import { LoginOtpUseCaseImpl } from "./login-otp/login-otp.usecase.impl";
import { LoginOtpUseCase } from "./login-otp/login-otp.usecase";
import { ValidateCodeUseCaseImpl } from './validate-code/validate-code.usecase.impl';
import { ValidateCodeUseCase } from './validate-code/validate-code.usecase';

export const LOGIN_USECASES: Provider[] = [
    {
      provide: LoginUseCase,
      useClass: LoginUseCaseImpl
    },
];

export const LOGIN_OTP_USECASES: Provider[] = [
    {
        provide: LoginOtpUseCase,
        useClass: LoginOtpUseCaseImpl
    },
    {
        provide: ValidateCodeUseCase,
        useClass: ValidateCodeUseCaseImpl
    }
];
