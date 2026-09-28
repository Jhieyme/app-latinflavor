import { Routes } from '@angular/router';
import { provideUserInternalFeature } from './user-internal.provider';

export const USER_INTERNAL_ROUTES: Routes = [{
  path: '',
  title: 'Personal interno | Latin Flavor',
  providers: provideUserInternalFeature(),
  loadComponent: () => import('./pages/user-internal/user-internal').then(m => m.UserInternalPage),
}];
