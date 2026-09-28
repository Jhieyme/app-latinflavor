import { AfterViewInit, Component, DestroyRef, ElementRef, ViewChild, computed, effect, inject, input, output, signal } from '@angular/core';
import { errorMessage } from '../../../../../../domain/models/errors/application-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserInternal } from '../../../../../../domain/models/user-internal/user-internal';
import { DisableUserInternalFacade } from '../../services/facades/disable-user-internal-facade';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-disable-user-internal',
  templateUrl: './disable-user-internal.html',
  styleUrl: './disable-user-internal.css',
})
export class DisableUserInternalDialog implements AfterViewInit {
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  readonly user = input.required<UserInternal>();
  readonly disabled = output<string>();
  readonly dismissed = output<void>();
  private readonly facade = inject(DisableUserInternalFacade);
  private readonly store = inject(AdminSessionStore);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly allowed = computed(() => this.store.canManageUser('disable'));

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
  confirm(): void {
    const user = this.user();
    if (this.saving() || !this.allowed() || !user.active || !user.id || !this.store.accessToken()) return;
    this.saving.set(true);
    this.error.set('');
    this.facade.execute(user.id).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.saving.set(false)),
    ).subscribe({
      next: () => {
        this.dialog.nativeElement.close();
        this.toast.show('Usuario deshabilitado correctamente.');
        this.disabled.emit(user.id);
      },
      error: (error: unknown) => { this.error.set(errorMessage(error)); },
    });
  }
}
