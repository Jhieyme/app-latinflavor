import { AfterViewInit, Component, DestroyRef, ElementRef, ViewChild, computed, effect, inject, output, signal } from '@angular/core';
import { errorMessage } from '../../../../../../domain/models/errors/application-error';
import { FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AppInput } from '../../../../shared/input/input';
import { CreateUserInternalFacade } from '../../services/facades/create-user-internal-facade';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';
import { PERMISSIONS } from '../../../../../../domain/models/auth/permissions';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-create-user-internal',
  imports: [FormsModule, AppInput],
  templateUrl: './create-user-internal.html',
  styleUrl: './create-user-internal.css',
})
export class CreateUserInternalDialog implements AfterViewInit {
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  private readonly facade = inject(CreateUserInternalFacade);
  private readonly store = inject(AdminSessionStore);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  readonly created = output<void>();
  readonly dismissed = output<void>();
  readonly saving = signal(false);
  readonly error = signal('');
  readonly allowed = computed(() => this.store.canManageUser('create'));
  username = '';
  password = '';
  email = '';
  firstName = '';
  paternalLastName = '';
  maternalLastName = '';
  phoneNumber = '';
  dni = '';
  readonly permissionOptions = [
    PERMISSIONS.USER_MANAGEMENT, PERMISSIONS.ACCESS_MANAGEMENT,
    PERMISSIONS.CUSTOMER_MANAGEMENT, PERMISSIONS.BOOKING_MANAGEMENT,
    PERMISSIONS.TABLE_MANAGEMENT, PERMISSIONS.SCHEDULE_MANAGEMENT,
    PERMISSIONS.CATALOG_MANAGEMENT, PERMISSIONS.REPORT_MANAGEMENT,
    PERMISSIONS.BASIC_MANAGEMENT, PERMISSIONS.CREATE_USER, PERMISSIONS.READ_USER,
    PERMISSIONS.UPDATE_USER, PERMISSIONS.UPDATE_OWN_USER, PERMISSIONS.DISABLE_USER, PERMISSIONS.MANAGE_USER_ACCESS,
  ];
  selectedPermissions: string[] = [PERMISSIONS.USER_MANAGEMENT];
  onPermissionsClick(event: Event): void {
    if (this.saving()) event.preventDefault();
  }

  togglePermission(permission: string): void {
    if (this.saving()) return;
    this.selectedPermissions = this.selectedPermissions.includes(permission)
      ? this.selectedPermissions.filter(value => value !== permission)
      : [...this.selectedPermissions, permission];
  }
  role: 'INTERNAL' | 'ADMIN' = 'INTERNAL';

  constructor() {
    effect(() => {
      if (this.store.expired()) {
        this.dialog?.nativeElement.close();
        this.dismissed.emit();
      }
    });
  }

  ngAfterViewInit(): void { this.dialog.nativeElement.showModal(); }

  cancel(event?: Event): void {
    event?.preventDefault();
    if (this.saving()) return;
    this.dialog.nativeElement.close();
    this.dismissed.emit();
  }

  submit(form: NgForm): void {
    if (this.saving() || !this.allowed()) return;
    if (!this.store.accessToken()) return;
    const permissions = [...new Set(this.selectedPermissions)];
    if (form.invalid || !permissions.length) {
      form.control.markAllAsTouched();
      this.error.set('Revisa los campos obligatorios y sus formatos.');
      return;
    }
    this.saving.set(true);
    this.error.set('');
    this.facade.execute({
      username: this.username.trim(), password: this.password, email: this.email.trim(), role: this.role,
      firstName: this.firstName.trim(), paternalLastName: this.paternalLastName.trim(),
      maternalLastName: this.maternalLastName.trim(), phoneNumber: this.phoneNumber.trim(),
      dni: this.dni.trim(), permissions,
    }).pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false))).subscribe({
      next: () => {
        this.password = '';
        this.dialog.nativeElement.close();
        this.toast.show('Usuario creado correctamente.');
        this.created.emit();
      },
      error: (error: unknown) => { this.error.set(errorMessage(error)); },
    });
  }
}
