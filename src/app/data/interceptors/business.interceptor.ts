import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiManifest } from '../constants/api-manifest';
import { ADMIN_ACCESS_TOKEN } from './admin-access-token';
import { EXPIRE_ADMIN_SESSION } from './identity-error.interceptor';
import { mapBusinessError } from '../mappers/business-error.mapper';

export const businessInterceptor: HttpInterceptorFn = (request, next) => {
  if (
    !Object.values(ApiManifest.BUSINESS).some(
      (base) => request.url === base || request.url.startsWith(`${base}/`),
    )
  )
  return next(request);

  const token = inject(ADMIN_ACCESS_TOKEN)();
  const expire = inject(EXPIRE_ADMIN_SESSION);
  return next(
    token ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request,
  ).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) return throwError(() => error);
      if (error.status === 401) expire();
      return throwError(() => mapBusinessError(error));
    }),
  );
};
