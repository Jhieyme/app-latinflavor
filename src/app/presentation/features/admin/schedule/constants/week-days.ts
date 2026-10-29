import { WeekDay } from '../../../../../domain/models/schedule/operating-hours';

export const WEEK_DAY_LABELS: Record<WeekDay, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sábado',
  SUNDAY: 'Domingo',
};

export const WEEK_DAYS = (Object.keys(WEEK_DAY_LABELS) as WeekDay[]).map((value) => ({
  value,
  label: WEEK_DAY_LABELS[value],
}));
