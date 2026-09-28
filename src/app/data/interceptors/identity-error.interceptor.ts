import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiManifest } from '../constants/api-manifest';
import { mapIdentityError } from '../mappers/identity-error.mapper';

export const EXPIRE_ADMIN_SESSION = new InjectionToken<() => void>('EXPIRE_ADMIN_SESSION');

export const identityErrorInterceptor: HttpInterceptorFn = (request, next) => {
  const path = request.url.split('?')[0];
  const usersUrl = ApiManifest.IDENTITY.USER;
  const protectedRequest = path === usersUrl || path.startsWith(`${usersUrl}/`);
  if (
    !protectedRequest &&
    path !== ApiManifest.IDENTITY.TOKEN &&
    path !== ApiManifest.IDENTITY.GENERATE_CODE
  )
    return next(request);
  const expireSession = protectedRequest ? inject(EXPIRE_ADMIN_SESSION) : null;
  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) return throwError(() => error);
      if (error.status === 401) expireSession?.();
      return throwError(() => mapIdentityError(error, request.method, request.url, request.body));
    }),
  );
};
