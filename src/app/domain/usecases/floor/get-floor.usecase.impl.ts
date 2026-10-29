import { Injectable, inject } from '@angular/core';
import { FloorKind } from '../../models/floor/floor';
import { FloorRepository } from '../../repository/floor/floor.repository';
import { GetFloorUseCase } from './get-floor.usecase';
@Injectable()
export class GetFloorUseCaseImpl extends GetFloorUseCase {
  private readonly repository = inject(FloorRepository);
  override execute<K extends FloorKind>(kind: K, id: string) { return this.repository.get(kind, id); }
}
