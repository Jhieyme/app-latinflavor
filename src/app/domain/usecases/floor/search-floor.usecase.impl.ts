import { Injectable, inject } from '@angular/core';
import { FloorKind, FloorSearch } from '../../models/floor/floor';
import { FloorRepository } from '../../repository/floor/floor.repository';
import { SearchFloorUseCase } from './search-floor.usecase';
@Injectable()
export class SearchFloorUseCaseImpl extends SearchFloorUseCase {
  private readonly repository = inject(FloorRepository);
  override execute<K extends FloorKind>(kind: K, query: FloorSearch) { return this.repository.search(kind, query); }
}
