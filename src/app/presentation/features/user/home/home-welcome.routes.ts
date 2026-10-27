import { CUSTOMER_PROVIDERS } from '../customer.provider';
import { Routes } from '@angular/router';

export const HOME_WELCOME_ROUTES: Routes = [
  {
    path: '',
    providers: CUSTOMER_PROVIDERS,
    children: [
      {
        path: '',
        title: 'Bienvenidos | Latin Flavor',
        loadComponent: () =>
          import('./layouts/home-welcome-layout/home-welcome-layout')
            .then(c => c.HomeWelcomeLayout),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/home-welcome/home-welcome')
                .then(c => c.HomeWelcome),
          },
        ],
      },
    ],
  },
];
