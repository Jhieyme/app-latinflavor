import { Injectable, inject } from '@angular/core';
import { ScheduleSearch } from '../../models/schedule/operating-hours';
import { ScheduleRepository } from '../../repository/schedule/schedule.repository';
import { SearchScheduleUseCase } from './search-schedule.usecase';
@Injectable()
export class SearchScheduleUseCaseImpl extends SearchScheduleUseCase {
  private readonly repository = inject(ScheduleRepository);
  override execute(query: ScheduleSearch) { return this.repository.search(query); }
}
