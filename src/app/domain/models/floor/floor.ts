export type FloorKind = 'zones' | 'tables';
export interface Zone { id: string; code: string; name: string; description: string; active: boolean; }
export interface DiningTable { id: string; zoneId: string; tableNumber: number; tableCode: string; capacity: number; active: boolean; }
export interface ZoneInput { code: string; name: string; description: string; }
export interface DiningTableInput { zoneId: string; tableNumber: number; capacity: number; }
export interface FloorEntities { zones: Zone; tables: DiningTable; }
export interface FloorInputs { zones: ZoneInput; tables: DiningTableInput; }
export interface FloorPage<T> { items: T[]; page: number; size: number; totalElements: number; totalPages: number; }
export interface FloorSearch { page: number; size: number; q?: string; filter?: string; sort: string; direction: 'asc' | 'desc'; }
