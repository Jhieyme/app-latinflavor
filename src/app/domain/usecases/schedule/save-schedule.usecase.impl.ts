import { Injectable, inject } from '@angular/core';
import { CreateScheduleInput } from '../../models/schedule/operating-hours';
import { ScheduleRepository } from '../../repository/schedule/schedule.repository';
import { SaveScheduleUseCase } from './save-schedule.usecase';
@Injectable()
export class SaveScheduleUseCaseImpl extends SaveScheduleUseCase {
  private readonly repository = inject(ScheduleRepository);
  override execute(data: CreateScheduleInput, id?: string) { return id ? this.repository.update(id, data) : this.repository.create(data); }
}
