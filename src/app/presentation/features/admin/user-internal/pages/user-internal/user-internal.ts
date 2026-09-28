import { UserInternalDetail } from '../../components/user-internal-detail/user-internal-detail';
import { errorMessage } from '../../../../../../domain/models/errors/application-error';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { UpdateUserInternalDialog } from '../../components/update-user-internal/update-user-internal';
import { DisableUserInternalDialog } from '../../components/disable-user-internal/disable-user-internal';
import { CreateUserInternalDialog } from '../../components/create-user-internal/create-user-internal';
import { AppInput } from '../../../../shared/input/input';
import { UserInternalTable } from '../../components/user-internal-table/user-internal-table';
import { UserInternal } from '../../../../../../domain/models/user-internal/user-internal';
import { UserInternalFacade } from '../../services/facades/user-internal-facade';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';

@Component({
  selector: 'app-user-internal',
  imports: [UserInternalDetail, FormsModule, AppInput, UserInternalTable, CreateUserInternalDialog, DisableUserInternalDialog, UpdateUserInternalDialog],
  templateUrl: './user-internal.html',
  styleUrl: './user-internal.css',
})
export class UserInternalPage {
  
  private readonly facade = inject(UserInternalFacade);
  private readonly store = inject(AdminSessionStore);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  readonly name_user = computed(() => this.store.session()?.username ?? 'usuario');
  readonly detailUser = signal<UserInternal | null>(null);
  readonly users = signal<readonly UserInternal[]>([]);
  readonly editingUser = signal<UserInternal | null>(null);
  readonly canEdit = computed(() => this.store.canManageUser('update') || this.store.canManageUser('access'));
  readonly canDisable = computed(() => this.store.canManageUser('disable'));
  readonly disablingUser = signal<UserInternal | null>(null);

  onDisabled(id: string): void {
    this.disablingUser.set(null);
    this.users.update(users => users.map(user => user.id === id ? { ...user, active: false } : user));
    this.load();
  }
  readonly canCreate = computed(() => this.store.canManageUser('create'));
  readonly creating = signal(false);

  onCreated(): void {
    this.creating.set(false);
    this.resetFilters();
    this.load();
  }
  readonly canRead = computed(() => this.store.canManageUser('read'));
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly status = signal<'all' | 'active' | 'inactive'>('all');
  readonly activeCount = computed(() => this.users().filter(user => user.active).length);

  readonly filteredUsers = computed(() => {
    const normalize = (text: string) => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const query = normalize(this.search().trim());
    return this.users().filter(user =>
      (this.status() === 'all' || user.active === (this.status() === 'active')) &&
      normalize([user.username, user.firstName, user.paternalLastName, user.maternalLastName,
      user.email, user.dni, user.phoneNumber, user.employeeCode, ...user.roles, ...user.permissions].join(' ')).includes(query));
  });

  resetFilters(): void {
    this.search.set('');
    this.status.set('all');
  }

  constructor() { this.load(); }

  load(): void {
    if (!this.canRead()) {
      this.users.set([]);
      return;
    }
    if (this.loading()) return;
    this.loading.set(true);
    this.errorMessage.set('');
    this.facade.execute().pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: users => this.users.set(users),
      error: (error: unknown) => { this.users.set([]); this.errorMessage.set(errorMessage(error)); },
    });
  }

  signOut(): void {
    this.store.clear();
    void this.router.navigate(['/admin/login']);
  }
}
