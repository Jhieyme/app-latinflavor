import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApiManifest } from '../constants/api-manifest';
import { mapCustomerError } from '../mappers/customer-error.mapper';

export const CUSTOMER_ACCESS_TOKEN = new InjectionToken<() => string | undefined>(
  'CUSTOMER_ACCESS_TOKEN',
);

export const EXPIRE_CUSTOMER_SESSION = new InjectionToken<() => void>('EXPIRE_CUSTOMER_SESSION');

export const customerInterceptor: HttpInterceptorFn = (request, next) => {
  const base = ApiManifest.CUSTOMER.CUSTOMER;
  if (request.url !== base && !request.url.startsWith(`${base}/`)) return next(request);
  const expire = inject(EXPIRE_CUSTOMER_SESSION);
  const token = inject(CUSTOMER_ACCESS_TOKEN)();
  const authenticated = token
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;
  return next(authenticated).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) return throwError(() => error);
      if (error.status === 401) expire();
      return throwError(() => mapCustomerError(error));
    }),
  );
};
