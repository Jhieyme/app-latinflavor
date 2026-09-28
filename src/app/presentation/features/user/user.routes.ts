import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home-welcome.routes').then(m => m.HOME_WELCOME_ROUTES),
  },
  {
    path: 'login-otp',
    loadChildren: () =>
      import('./login-otp/login-otp.routes').then(m => m.LOGIN_OTP_ROUTES),
  },
  { path: '**', redirectTo: 'home' },
];
