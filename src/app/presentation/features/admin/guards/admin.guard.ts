import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AdminSessionStore } from '../login/services/store/admin-session.store';

export const adminGuard: CanActivateFn = () => {
  const store = inject(AdminSessionStore);
  const token = store.accessToken();
  if (store.expired()) return false;
  return !!token
    ? true : inject(Router).createUrlTree(['/admin/login']);
};
