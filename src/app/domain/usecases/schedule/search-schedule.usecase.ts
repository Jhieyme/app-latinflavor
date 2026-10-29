import { Observable } from 'rxjs';
import { ScheduleSearch, SchedulePage } from '../../models/schedule/operating-hours';
export abstract class SearchScheduleUseCase {
  abstract execute(query: ScheduleSearch): Observable<SchedulePage>;
}
