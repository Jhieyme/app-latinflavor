import { Routes } from '@angular/router';

export const ADMIN_LOGIN_ROUTES: Routes = [
  {
    path: '',
    title: 'Administración | Latin Flavor',
    loadComponent: () => import('./layouts/login-layout/login-layout').then(m => m.AdminLoginLayout),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/login/login').then(m => m.AdminLogin),
      },
    ],
  },
];
