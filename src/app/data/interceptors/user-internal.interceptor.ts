import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ApiManifest } from '../constants/api-manifest';
import { ADMIN_ACCESS_TOKEN } from './admin-access-token';

export const userInternalInterceptor: HttpInterceptorFn = (request, next) => {
  const usersUrl = ApiManifest.IDENTITY.USER;
  if (request.url !== usersUrl && !request.url.startsWith(`${usersUrl}/`)) return next(request);
  const token = inject(ADMIN_ACCESS_TOKEN)();
  if (token) {
    return next(request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
  }
  return next(request);
};
