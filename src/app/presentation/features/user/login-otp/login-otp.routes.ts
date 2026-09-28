import { Routes } from '@angular/router';
import { provideLoginOtpFeature } from './login-otp.provider';

export const LOGIN_OTP_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        title: 'Iniciar Sesión',
        providers: provideLoginOtpFeature(),
        loadComponent: () =>
          import('./layouts/login-otp-layout/login-otp-layout')
            .then(c => c.LoginOtpLayout),
        children: [
          {
            path: '',
            pathMatch: 'full',
            loadComponent: () =>
              import('./pages/login-otp/login-otp')
                .then(c => c.LoginOtp),
          },
          {
            path: 'validate-code',
            title: 'Validar código | Latin Flavor',
            loadComponent: () =>
              import('./pages/validate-code/validate-code')
                .then(c => c.ValidateCode),
          },
        ],
      },
    ],
  },
];
