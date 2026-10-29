import { FloorEntities, FloorKind } from '../../domain/models/floor/floor';
import { FloorResponses } from '../dtos/floor-response';

export const FLOOR_MAPPERS: {
  [K in FloorKind]: (response: FloorResponses[K]) => FloorEntities[K];
} = {
  zones: (value) => ({
    id: value.id,
    code: value.code,
    name: value.name,
    description: value.description ?? '',
    active: value.isActive,
  }),
  tables: (value) => ({
    id: value.id,
    zoneId: value.zoneId,
    tableNumber: value.tableNumber,
    tableCode: value.tableCode,
    capacity: value.capacity,
    active: value.isActive,
  }),
};
