import { Observable } from 'rxjs';
import { OperatingHours } from '../../models/schedule/operating-hours';
export abstract class GetScheduleUseCase {
  abstract execute(id: string): Observable<OperatingHours>;
}
