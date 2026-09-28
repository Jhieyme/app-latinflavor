import { Routes } from '@angular/router';
import { provideAdminFeature } from './admin.provider';
import { adminGuard } from './guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: 'user-internal',
    canActivate: [adminGuard],
    loadChildren: () => import('./user-internal/user-internal.routes').then(m => m.USER_INTERNAL_ROUTES),
  },
  {
    path: 'login',
    providers: provideAdminFeature(),
    loadChildren: () => import('./login/login.routes').then(m => m.ADMIN_LOGIN_ROUTES),
  },
  { path: '**', redirectTo: 'login' },
];
