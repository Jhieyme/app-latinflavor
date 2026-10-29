import { WeekDay } from '../../domain/models/schedule/operating-hours';
export interface ScheduleResponse {
  id: string;
  dayOfWeek: WeekDay;
  openingTime: string;
  closingTime: string;
  reservationIntervalMs: number;
}
export interface SchedulePageResponse {
  content: ScheduleResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
export interface UpdateScheduleRequest {
  openingTime: string;
  closingTime: string;
  reservationIntervalMs: number;
}
export interface CreateScheduleRequest extends UpdateScheduleRequest {
  dayOfWeek: WeekDay;
}
