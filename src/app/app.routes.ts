import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'user' },
  {
    path: 'user',
    loadChildren: () => import('./presentation/features/user/user.routes').then(m => m.USER_ROUTES),
  },
  {
    path: 'admin',
    loadChildren: () => import('./presentation/features/admin/admin.routes').then(m => m.ADMIN_ROUTES),
  },
  { path: '**', redirectTo: 'user' },
];

