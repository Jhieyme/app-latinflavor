import { Injectable, inject } from '@angular/core';
import {
  CreateScheduleInput,
  ScheduleSearch,
} from '../../../../../domain/models/schedule/operating-hours';
import { SearchScheduleUseCase } from '../../../../../domain/usecases/schedule/search-schedule.usecase';
import { GetScheduleUseCase } from '../../../../../domain/usecases/schedule/get-schedule.usecase';
import { SaveScheduleUseCase } from '../../../../../domain/usecases/schedule/save-schedule.usecase';

@Injectable()
export class ScheduleFacade {

  private readonly searchUseCase = inject(SearchScheduleUseCase);
  private readonly getUseCase = inject(GetScheduleUseCase);
  private readonly saveUseCase = inject(SaveScheduleUseCase);

  search(query: ScheduleSearch) {
    return this.searchUseCase.execute(query);
  }

  get(id: string) {
    return this.getUseCase.execute(id);
  }

  save(data: CreateScheduleInput, id?: string) {
    return this.saveUseCase.execute(data, id);
  }

}
