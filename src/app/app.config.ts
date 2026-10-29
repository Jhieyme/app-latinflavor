import { businessInterceptor } from './data/interceptors/business.interceptor';
import { customerInterceptor, CUSTOMER_ACCESS_TOKEN, EXPIRE_CUSTOMER_SESSION } from './data/interceptors/customer.interceptor';
import { UserSessionStore } from './presentation/features/user/login-otp/services/store/user-session.store';
import { identityErrorInterceptor, EXPIRE_ADMIN_SESSION } from './data/interceptors/identity-error.interceptor';
import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { userInternalInterceptor } from './data/interceptors/user-internal.interceptor';
import { ADMIN_ACCESS_TOKEN } from './data/interceptors/admin-access-token';
import { AdminSessionStore } from './presentation/features/admin/login/services/store/admin-session.store';

import { routes } from './app.routes';
import { AdminSessionRepository } from './domain/repository/auth/admin-session.repository';
import { AdminSessionRepositoryImpl } from './data/services/auth/admin-session.repository.impl';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: EXPIRE_CUSTOMER_SESSION, useFactory: (store: UserSessionStore) => () => store.expire(), deps: [UserSessionStore] },
    { provide: CUSTOMER_ACCESS_TOKEN, useFactory: (store: UserSessionStore) => () => store.accessToken(), deps: [UserSessionStore] },
    { provide: AdminSessionRepository, useClass: AdminSessionRepositoryImpl },
    {
      provide: ADMIN_ACCESS_TOKEN,
      useFactory: (store: AdminSessionStore) => () => store.accessToken(),
      deps: [AdminSessionStore],
    },
    {
      provide: EXPIRE_ADMIN_SESSION,
      useFactory: (store: AdminSessionStore) => () => store.expire(),
      deps: [AdminSessionStore],
    },
    provideHttpClient(withInterceptors([identityErrorInterceptor, userInternalInterceptor, customerInterceptor, businessInterceptor])),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
