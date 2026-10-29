import { Routes } from '@angular/router';
import { provideScheduleFeature } from './schedule.provider';
export const SCHEDULE_ROUTES: Routes = [
  { path: '', providers: provideScheduleFeature(), loadComponent: () => import('./pages/schedule-management/schedule-management').then(m => m.ScheduleManagement) },
];
