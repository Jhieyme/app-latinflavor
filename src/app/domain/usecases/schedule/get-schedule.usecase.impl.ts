import { Injectable, inject } from '@angular/core';
import { ScheduleRepository } from '../../repository/schedule/schedule.repository';
import { GetScheduleUseCase } from './get-schedule.usecase';
@Injectable()
export class GetScheduleUseCaseImpl extends GetScheduleUseCase {
  private readonly repository = inject(ScheduleRepository);
  override execute(id: string) { return this.repository.get(id); }
}
