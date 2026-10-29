import { Observable } from 'rxjs';
import { CreateScheduleInput } from '../../models/schedule/operating-hours';
export abstract class SaveScheduleUseCase {
  abstract execute(data: CreateScheduleInput, id?: string): Observable<void>;
}
