export interface ZoneResponse {
  id: string;
  code: string;
  name: string;
  description: string | null;
  isActive: boolean;
}
export interface DiningTableResponse {
  id: string;
  zoneId: string;
  tableNumber: number;
  tableCode: string;
  capacity: number;
  isActive: boolean;
}
export interface FloorResponses {
  zones: ZoneResponse;
  tables: DiningTableResponse;
}
export interface FloorPageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
