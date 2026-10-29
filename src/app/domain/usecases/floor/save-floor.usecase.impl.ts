import { Injectable, inject } from '@angular/core';
import { FloorKind, FloorInputs } from '../../models/floor/floor';
import { FloorRepository } from '../../repository/floor/floor.repository';
import { SaveFloorUseCase } from './save-floor.usecase';
@Injectable()
export class SaveFloorUseCaseImpl extends SaveFloorUseCase {
  private readonly repository = inject(FloorRepository);
  override execute<K extends FloorKind>(kind: K, data: FloorInputs[K], id?: string) { return id ? this.repository.update(kind, id, data) : this.repository.create(kind, data); }
}
