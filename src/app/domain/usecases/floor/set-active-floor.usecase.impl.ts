import { Injectable, inject } from '@angular/core';
import { FloorKind } from '../../models/floor/floor';
import { FloorRepository } from '../../repository/floor/floor.repository';
import { SetActiveFloorUseCase } from './set-active-floor.usecase';
@Injectable()
export class SetActiveFloorUseCaseImpl extends SetActiveFloorUseCase {
  private readonly repository = inject(FloorRepository);
  override execute<K extends FloorKind>(kind: K, id: string, active: boolean) { return this.repository.setActive(kind, id, active); }
}
