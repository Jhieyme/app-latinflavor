import {
  OperatingHours,
  ScheduleInput,
  CreateScheduleInput,
} from '../../domain/models/schedule/operating-hours';
import {
  ScheduleResponse,
  UpdateScheduleRequest,
  CreateScheduleRequest,
} from '../dtos/schedule-response';

const MILLISECONDS_PER_MINUTE = 60_000;

export function mapSchedule(response: ScheduleResponse): OperatingHours {
  return {
    id: response.id,
    dayOfWeek: response.dayOfWeek,
    openingTime: response.openingTime,
    closingTime: response.closingTime,
    reservationIntervalMinutes: response.reservationIntervalMs / MILLISECONDS_PER_MINUTE,
  };
}
export function mapScheduleUpdate(input: ScheduleInput): UpdateScheduleRequest {
  return {
    openingTime: input.openingTime,
    closingTime: input.closingTime,
    reservationIntervalMs: Math.round(input.reservationIntervalMinutes * MILLISECONDS_PER_MINUTE),
  };
}
export function mapScheduleCreate(input: CreateScheduleInput): CreateScheduleRequest {
  return { ...mapScheduleUpdate(input), dayOfWeek: input.dayOfWeek };
}
