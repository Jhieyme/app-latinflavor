import { AfterViewInit, Component, DestroyRef, ElementRef, OnInit, ViewChild, computed, effect, inject, input, output, signal } from '@angular/core';
import { errorMessage } from '../../../../../../domain/models/errors/application-error';
import { FormsModule, NgForm } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, finalize } from 'rxjs';
import { UserInternal } from '../../../../../../domain/models/user-internal/user-internal';
import { PERMISSIONS } from '../../../../../../domain/models/auth/permissions';
import { AppInput } from '../../../../shared/input/input';
import { UpdateUserInternalFacade } from '../../services/facades/update-user-internal-facade';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-update-user-internal', imports: [FormsModule, AppInput],
  templateUrl: './update-user-internal.html', styleUrl: './update-user-internal.css',
})
export class UpdateUserInternalDialog implements OnInit, AfterViewInit {
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  readonly user = input.required<UserInternal>();
  readonly saved = output<void>();
  readonly dismissed = output<void>();
  private readonly facade = inject(UpdateUserInternalFacade);
  private readonly store = inject(AdminSessionStore);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  readonly canUpdate = computed(() => this.store.canManageUser('update'));
  readonly canAccess = computed(() => this.store.canManageUser('access'));
  readonly saving = signal<'info' | 'access' | null>(null);
  readonly error = signal('');
  readonly success = signal('');
  readonly permissionOptions = signal<string[]>(Object.values(PERMISSIONS));
  firstName = ''; paternalLastName = ''; maternalLastName = ''; phoneNumber = ''; dni = '';
  active = false;
  role: 'ADMIN' | 'INTERNAL' | '' = '';
  selectedPermissions: string[] = [];

  constructor() {
    effect(() => {
      if (this.store.expired()) { this.dialog?.nativeElement.close(); this.dismissed.emit(); }
    });
  }
  ngOnInit(): void {
    const user = this.user();
    this.firstName = user.firstName ?? '';
    this.paternalLastName = user.paternalLastName ?? '';
    this.maternalLastName = user.maternalLastName ?? '';
    this.phoneNumber = user.phoneNumber ?? '';
    this.dni = user.dni ?? '';
    this.active = user.active;
    const roles = user.roles ?? [];
    this.role = roles.length === 1 && (roles[0] === 'ADMIN' || roles[0] === 'INTERNAL') ? roles[0] : '';
    this.selectedPermissions = [...user.permissions];
    this.permissionOptions.set([...new Set([...Object.values(PERMISSIONS), ...user.permissions])]);
  }
  ngAfterViewInit(): void { this.dialog.nativeElement.showModal(); }
  cancel(event?: Event): void {
    event?.preventDefault();
    if (this.saving()) return;
    this.dialog.nativeElement.close(); this.dismissed.emit();
  }
  permissionsClick(event: Event): void {
    if (this.saving() || !this.canAccess()) event.preventDefault();
  }
  togglePermission(value: string): void {
    if (this.saving() || !this.canAccess()) return;
    this.selectedPermissions = this.selectedPermissions.includes(value)
      ? this.selectedPermissions.filter(p => p !== value) : [...this.selectedPermissions, value];
  }
  saveInfo(form: NgForm): void {
    if (this.saving() || !this.canUpdate() || !this.store.accessToken()) return;
    if (form.invalid) { form.control.markAllAsTouched(); this.error.set('Revisa los datos personales.'); return; }
    this.send(this.facade.updateInfo(this.user().id, {
      firstName: this.firstName.trim(), paternalLastName: this.paternalLastName.trim(),
      maternalLastName: this.maternalLastName.trim(), phoneNumber: this.phoneNumber.trim(), dni: this.dni.trim(),
      active: this.active,
    }), 'info');
  }
  saveAccess(form: NgForm): void {
    if (this.saving() || !this.canAccess() || !this.store.accessToken()) return;
    if (form.invalid || !this.role) { form.control.markAllAsTouched(); this.error.set('Selecciona el rol para guardar el acceso.'); return; }
    this.send(this.facade.updateAccess(this.user().id, {
      role: this.role, permissions: [...new Set(this.selectedPermissions)],
    }), 'access');
  }
  private send(request: Observable<void>, section: 'info' | 'access'): void {
    this.error.set(''); this.success.set(''); this.saving.set(section);
    request.pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(null))).subscribe({
      next: () => {
        const message = section === 'info' ? 'Datos personales actualizados.' : 'Rol y permisos actualizados.';
        this.success.set(message); this.toast.show(message); this.saved.emit();
      },
      error: (error: unknown) => { this.error.set(errorMessage(error)); },
    });
  }
}
