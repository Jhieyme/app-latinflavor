import { Observable } from 'rxjs';
import { CreateScheduleInput, ScheduleInput, OperatingHours, SchedulePage, ScheduleSearch } from '../../models/schedule/operating-hours';
export abstract class ScheduleRepository {
  abstract search(query: ScheduleSearch): Observable<SchedulePage>;
  abstract get(id: string): Observable<OperatingHours>;
  abstract create(data: CreateScheduleInput): Observable<void>;
  abstract update(id: string, data: ScheduleInput): Observable<void>;
}
