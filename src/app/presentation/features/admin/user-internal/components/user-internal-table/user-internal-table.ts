import { Component, input, output } from '@angular/core';
import { UserInternal } from '../../../../../../domain/models/user-internal/user-internal';

@Component({
  selector: 'app-user-internal-table',
  templateUrl: './user-internal-table.html',
  styleUrl: './user-internal-table.css',
})
export class UserInternalTable {
  readonly users = input.required<readonly UserInternal[]>();
  readonly clearFilters = output<void>();
  readonly canEdit = input(false);
  readonly editUser = output<UserInternal>();
  readonly canDisable = input(false);
  readonly disableUser = output<UserInternal>();
  readonly detailUser = output<UserInternal>();

  fullName(user: UserInternal): string {
    return [user.firstName, user.paternalLastName, user.maternalLastName]
      .filter(Boolean).join(' ') || 'Sin nombre';
  }
}
