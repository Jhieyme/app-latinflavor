import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    title: 'Administración | Latin Flavor',
    loadComponent: () => import('./pages/login/login').then(m => m.AdminLogin),
  },
];
