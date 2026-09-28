import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { errorMessage } from '../../../../../../domain/models/errors/application-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { UserInternal } from '../../../../../../domain/models/user-internal/user-internal';
import { UserInternalFacade } from '../../services/facades/user-internal-facade';
import { AdminSessionStore } from '../../../login/services/store/admin-session.store';

@Component({
  selector: 'app-user-internal-detail',
  templateUrl: './user-internal-detail.html',
  styleUrl: './user-internal-detail.css',
})
export class UserInternalDetail implements AfterViewInit {
  @ViewChild('dialog', { static: true }) private dialog!: ElementRef<HTMLDialogElement>;
  readonly userId = input.required<string>();
  readonly dismissed = output<void>();
  readonly user = signal<UserInternal | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  private readonly facade = inject(UserInternalFacade);
  private readonly store = inject(AdminSessionStore);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (this.store.expired()) this.close();
    });
  }

  ngAfterViewInit(): void {
    this.dialog.nativeElement.showModal();
    this.load();
  }

  close(event?: Event): void {
    event?.preventDefault();
    this.dialog?.nativeElement.close();
    this.dismissed.emit();
  }

  backdropClick(event: MouseEvent): void {
    if (event.target !== this.dialog.nativeElement) return;
    const rect = this.dialog.nativeElement.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      this.close();
  }

  load(): void {
    if (this.loading()) return;
    this.user.set(null);
    this.error.set('');
    if (!this.store.canManageUser('read')) {
      this.error.set('No tienes permiso para consultar este usuario.');
      return;
    }
    this.loading.set(true);
    this.facade
      .detail(this.userId())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (user) => this.user.set(user),
        error: (error: unknown) => {
          this.error.set(errorMessage(error));
        },
      });
  }
}
