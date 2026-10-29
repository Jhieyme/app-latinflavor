import { Component, input, output } from '@angular/core';
import { DiningTable } from '../../../../../../domain/models/floor/floor';

@Component({
  selector: 'app-dining-table-cards',
  templateUrl: './dining-table-cards.html',
})
export class DiningTableCards {
  readonly tables = input.required<DiningTable[]>();
  readonly selected = output<{ id: string; mode: 'edit' | 'detail' | 'status' }>();
  readonly seats = [
    { x: 44, y: 12 },
    { x: 44, y: 90 },
    { x: 12, y: 38 },
    { x: 90, y: 38 },
    { x: 12, y: 64 },
    { x: 90, y: 64 },
  ];
}
