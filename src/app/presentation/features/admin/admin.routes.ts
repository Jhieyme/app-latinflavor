import { Routes } from '@angular/router';
import { provideAdminFeature } from './admin.provider';
import { adminGuard } from './guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'login',
    providers: provideAdminFeature(),
    loadChildren: () => import('./login/login.routes').then(m => m.ADMIN_LOGIN_ROUTES),
  },
  {
    path: '',
    canActivate: [adminGuard],
    canActivateChild: [adminGuard],
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    children: [
      { path: 'schedule', loadChildren: () => import('./schedule/schedule.routes').then(m => m.SCHEDULE_ROUTES) },
      { path: 'floor', loadChildren: () => import('./floor/floor.routes').then(m => m.FLOOR_ROUTES) },
      { path: 'user-internal', loadChildren: () => import('./user-internal/user-internal.routes').then(m => m.USER_INTERNAL_ROUTES) },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
