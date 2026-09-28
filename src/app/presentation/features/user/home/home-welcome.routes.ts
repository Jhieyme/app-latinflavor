import { Routes } from '@angular/router';

export const HOME_WELCOME_ROUTES: Routes = [
  {
    path: '',
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
