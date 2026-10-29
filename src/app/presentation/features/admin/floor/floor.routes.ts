import { Routes } from '@angular/router';
import { provideFloorFeature } from './floor.provider';
export const FLOOR_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'zones' },
  { path: 'zones', data: { kind: 'zones' }, providers: provideFloorFeature(), loadComponent: () => import('./pages/floor-management/floor-management').then(m => m.FloorManagement) },
  { path: 'tables', data: { kind: 'tables' }, providers: provideFloorFeature(), loadComponent: () => import('./pages/floor-management/floor-management').then(m => m.FloorManagement) },
];
