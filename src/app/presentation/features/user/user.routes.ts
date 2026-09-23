import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Inicia sesión | Latin Flavor',
    loadComponent: () => import('./pages/login/login').then(m => m.Login),
  },
  {
    path: '',
    pathMatch: 'full',
    title: 'Bienvenido | Latin Flavor',
    loadComponent: () => import('./pages/home/home').then(m => m.Home),
  },
  {
    path: 'reserva',
    title: 'Reserva tu mesa | Latin Flavor',
    loadComponent: () => import('./pages/reservation/reservation').then(m => m.Reservation),
  },
];
