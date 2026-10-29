import { Provider } from '@angular/core';
import { FloorRepository } from '../../../../domain/repository/floor/floor.repository';
import { FloorRepositoryImpl } from '../../../../data/services/floor/floor.repository.impl';
import { FloorFacade } from './services/floor.facade';
import { SearchFloorUseCase } from '../../../../domain/usecases/floor/search-floor.usecase';
import { SearchFloorUseCaseImpl } from '../../../../domain/usecases/floor/search-floor.usecase.impl';
import { GetFloorUseCase } from '../../../../domain/usecases/floor/get-floor.usecase';
import { GetFloorUseCaseImpl } from '../../../../domain/usecases/floor/get-floor.usecase.impl';
import { SaveFloorUseCase } from '../../../../domain/usecases/floor/save-floor.usecase';
import { SaveFloorUseCaseImpl } from '../../../../domain/usecases/floor/save-floor.usecase.impl';
import { SetActiveFloorUseCase } from '../../../../domain/usecases/floor/set-active-floor.usecase';
import { SetActiveFloorUseCaseImpl } from '../../../../domain/usecases/floor/set-active-floor.usecase.impl';

export function provideFloorFeature(): Provider[] {
  return [
    FloorFacade,
    { provide: FloorRepository, useClass: FloorRepositoryImpl },
    { provide: SearchFloorUseCase, useClass: SearchFloorUseCaseImpl },
    { provide: GetFloorUseCase, useClass: GetFloorUseCaseImpl },
    { provide: SaveFloorUseCase, useClass: SaveFloorUseCaseImpl },
    { provide: SetActiveFloorUseCase, useClass: SetActiveFloorUseCaseImpl },
  ];
}
