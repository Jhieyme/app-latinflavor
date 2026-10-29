export type WeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
export interface ScheduleInput {
  openingTime: string;
  closingTime: string;
  reservationIntervalMinutes: number;
}
export interface CreateScheduleInput extends ScheduleInput { dayOfWeek: WeekDay; }
export interface OperatingHours extends CreateScheduleInput { id: string; }
export type ScheduleSort = 'dayOfWeek' | 'openingTime' | 'closingTime' | 'reservationIntervalMs';
export interface ScheduleSearch { day?: WeekDay; page: number; size: number; sort: ScheduleSort; direction: 'asc' | 'desc'; }
export interface SchedulePage { items: OperatingHours[]; page: number; size: number; totalElements: number; totalPages: number; }
