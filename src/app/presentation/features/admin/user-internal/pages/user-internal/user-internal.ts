import {
  UserSearchField,
  UserSortField,
  SortDirection,
} from '../../../../../../domain/models/user-internal/search-user-internal';
import { ToastService } from '../../../../../services/toast/toast.service';
import { UserInternalDetail } from '../../components/user-internal-detail/user-internal-detail';
import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subscription, timer } from 'rxjs';
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
  imports: [
    UserInternalDetail,
    FormsModule,
    AppInput,
    UserInternalTable,
    CreateUserInternalDialog,
    DisableUserInternalDialog,
    UpdateUserInternalDialog,
  ],
  templateUrl: './user-internal.html',
  styleUrl: './user-internal.css',
})
export class UserInternalPage {
  private readonly toast = inject(ToastService);
  private readonly facade = inject(UserInternalFacade);
  private readonly store = inject(AdminSessionStore);
  private readonly destroyRef = inject(DestroyRef);

  readonly detailUser = signal<UserInternal | null>(null);
  readonly users = signal<readonly UserInternal[]>([]);
  readonly editingUser = signal<UserInternal | null>(null);
  readonly canEdit = computed(
    () => this.store.canManageUser('update') || this.store.canManageUser('access'),
  );

  readonly canDisable = computed(() => this.store.canManageUser('disable'));
  readonly disablingUser = signal<UserInternal | null>(null);

  onDisabled(id: string): void {
    this.disablingUser.set(null);
    this.users.update((users) =>
      users.map((user) => (user.id === id ? { ...user, active: false } : user)),
    );
    this.load();
  }

  readonly canCreate = computed(() => this.store.canManageUser('create'));
  readonly creating = signal(false);

  onCreated(): void {
    this.creating.set(false);
    this.resetFilters();
  }

  readonly canRead = computed(() => this.store.canManageUser('read'));
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly search = signal('');
  readonly status = signal<'all' | 'active' | 'inactive'>('all');
  readonly field = signal<UserSearchField | ''>('');
  readonly sort = signal<UserSortField>('username');
  readonly direction = signal<SortDirection>('asc');
  readonly page = signal(0);
  readonly size = signal(5);
  readonly totalElements = signal(0);
  readonly totalPages = signal(0);
  readonly activeCount = computed(() => this.users().filter((user) => user.active).length);
  readonly firstResult = computed(() => (this.users().length ? this.page() * this.size() + 1 : 0));
  readonly lastResult = computed(() =>
    this.users().length ? this.page() * this.size() + this.users().length : 0,
  );
  
  readonly fields: readonly { value: UserSearchField; label: string }[] = [
    { value: 'username', label: 'Usuario' },
    { value: 'firstName', label: 'Nombres' },
    { value: 'paternalLastName', label: 'Apellido paterno' },
    { value: 'maternalLastName', label: 'Apellido materno' },
    { value: 'email', label: 'Correo' },
    { value: 'phoneNumber', label: 'Celular' },
    { value: 'dni', label: 'DNI' },
    { value: 'employeeCode', label: 'Código de empleado' },
  ];

  private request?: Subscription;
  private searchDelay?: Subscription;

  constructor() {
    this.load();
  }

  onSearch(value: string): void {
    this.search.set(value);
    this.status.set('all');
    this.page.set(0);
    this.request?.unsubscribe();
    this.searchDelay?.unsubscribe();
    this.loading.set(true);
    this.searchDelay = timer(350)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.load());
  }

  onStatusChange(status: 'all' | 'active' | 'inactive'): void {
    this.status.set(status);
    this.search.set('');
    this.field.set('');
    this.onCriteriaChange();
  }

  onFieldChange(field: UserSearchField | ''): void {
    this.field.set(field);
    this.status.set('all');
    this.onCriteriaChange();
  }

  onCriteriaChange(): void {
    this.page.set(0);
    this.load();
  }

  goToPage(page: number): void {
    if (this.loading() || page < 0 || page >= this.totalPages()) return;
    this.page.set(page);
    this.load();
  }

  resetFilters(): void {
    this.search.set('');
    this.status.set('all');
    this.field.set('');
    this.sort.set('username');
    this.direction.set('asc');
    this.onCriteriaChange();
  }

  load(): void {
    this.searchDelay?.unsubscribe();
    this.request?.unsubscribe();
    if (!this.canRead()) {
      this.users.set([]);
      this.totalElements.set(0);
      this.totalPages.set(0);
      this.loading.set(false);
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    const field = this.field();
    const status = this.status();
    const filters: readonly UserSearchField[] =
      status === 'all' ? (field ? [field] : []) : ['active'];
    this.request = this.facade
      .execute({
        q: status === 'all' ? this.search() : String(status === 'active'),
        filters,
        page: this.page(),
        size: this.size(),
        sort: this.sort(),
        direction: this.direction(),
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => {
          this.totalElements.set(result.totalElements);
          this.totalPages.set(result.totalPages);
          if (result.page > 0 && result.page >= result.totalPages) {
            this.page.set(Math.max(0, result.totalPages - 1));
            this.load();
            return;
          }
          this.users.set(result.users);
          this.page.set(result.page);
          this.size.set(result.size);
          this.loading.set(false);
        },
        error: (error: unknown) => {
          this.loading.set(false);
          this.users.set([]);
          this.totalElements.set(0);
          this.totalPages.set(0);
          this.errorMessage.set('No se pudo cargar la lista.');
          this.toast.showError(error);
        },
      });
  }
}
