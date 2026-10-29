import { Provider } from '@angular/core';
import { ScheduleRepository } from '../../../../domain/repository/schedule/schedule.repository';
import { ScheduleRepositoryImpl } from '../../../../data/services/schedule/schedule.repository.impl';
import { ScheduleFacade } from './services/schedule.facade';
import { SearchScheduleUseCase } from '../../../../domain/usecases/schedule/search-schedule.usecase';
import { SearchScheduleUseCaseImpl } from '../../../../domain/usecases/schedule/search-schedule.usecase.impl';
import { GetScheduleUseCase } from '../../../../domain/usecases/schedule/get-schedule.usecase';
import { GetScheduleUseCaseImpl } from '../../../../domain/usecases/schedule/get-schedule.usecase.impl';
import { SaveScheduleUseCase } from '../../../../domain/usecases/schedule/save-schedule.usecase';
import { SaveScheduleUseCaseImpl } from '../../../../domain/usecases/schedule/save-schedule.usecase.impl';

export function provideScheduleFeature(): Provider[] {
  return [
    ScheduleFacade,
    { provide: ScheduleRepository, useClass: ScheduleRepositoryImpl },
    { provide: SearchScheduleUseCase, useClass: SearchScheduleUseCaseImpl },
    { provide: GetScheduleUseCase, useClass: GetScheduleUseCaseImpl },
    { provide: SaveScheduleUseCase, useClass: SaveScheduleUseCaseImpl },
  ];
}
