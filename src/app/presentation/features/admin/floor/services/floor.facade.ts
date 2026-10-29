import { Injectable, inject } from '@angular/core';
import { EMPTY, expand, map, reduce } from 'rxjs';
import {
  FloorKind,
  FloorSearch,
  FloorInputs,
  Zone,
} from '../../../../../domain/models/floor/floor';
import { SearchFloorUseCase } from '../../../../../domain/usecases/floor/search-floor.usecase';
import { GetFloorUseCase } from '../../../../../domain/usecases/floor/get-floor.usecase';
import { SaveFloorUseCase } from '../../../../../domain/usecases/floor/save-floor.usecase';
import { SetActiveFloorUseCase } from '../../../../../domain/usecases/floor/set-active-floor.usecase';

@Injectable()
export class FloorFacade {

  private readonly searchUseCase = inject(SearchFloorUseCase);
  private readonly getUseCase = inject(GetFloorUseCase);
  private readonly saveUseCase = inject(SaveFloorUseCase);
  private readonly activeUseCase = inject(SetActiveFloorUseCase);

  search<K extends FloorKind>(kind: K, query: FloorSearch) {
    return this.searchUseCase.execute(kind, query);
  }

  get<K extends FloorKind>(kind: K, id: string) {
    return this.getUseCase.execute(kind, id);
  }

  save<K extends FloorKind>(kind: K, data: FloorInputs[K], id?: string) {
    return this.saveUseCase.execute(kind, data, id);
  }

  setActive(kind: FloorKind, id: string, active: boolean) {
    return this.activeUseCase.execute(kind, id, active);
  }

  zones() {
    const query: FloorSearch = { page: 0, size: 100, sort: 'name', direction: 'asc' };
    return this.search('zones', query).pipe(
      expand((page) =>
        page.page + 1 < page.totalPages
          ? this.search('zones', { ...query, page: page.page + 1 })
          : EMPTY,
      ),
      map((page) => page.items),
      reduce((zones, items) => [...zones, ...items], [] as Zone[]),
    );
  }
  
}
