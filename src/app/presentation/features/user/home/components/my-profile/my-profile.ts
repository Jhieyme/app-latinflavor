import { AfterViewInit, Component, DestroyRef, ElementRef, effect, inject, output, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CompleteProfile } from '../../../login-otp/components/complete-profile/complete-profile';
import { CustomerProfileFacade } from '../../../login-otp/services/facades/customer-profile-facade';
import { UserSessionStore } from '../../../login-otp/services/store/user-session.store';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-my-profile',
  imports: [CompleteProfile],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile implements AfterViewInit {
  readonly dismissed = output<void>();
  readonly loading = signal(false);
  readonly failed = signal(false);
  readonly ready = signal(false);
  readonly form = viewChild(CompleteProfile);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly store = inject(UserSessionStore);
  private readonly facade = inject(CustomerProfileFacade);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (!this.store.signedIn()) {
        this.dialog().nativeElement.close();
        this.dismissed.emit();
      }
    });
  }

  ngAfterViewInit(): void {
    if (!this.store.accessToken() || !this.store.signedIn()) { this.dismissed.emit(); return; }
    this.dialog().nativeElement.showModal();
    this.load();
  }

  load(): void {
    if (this.loading() || !this.store.accessToken()) return;
    const userId = this.store.session()?.userId;
    if (!userId) return;
    this.loading.set(true);
    this.failed.set(false);
    this.ready.set(false);
    this.facade.get(userId).pipe(
      takeUntilDestroyed(this.destroyRef), finalize(() => this.loading.set(false)),
    ).subscribe({
      next: customer => {
        this.store.setProfile(customer);
        this.ready.set(this.store.signedIn());
      },
      error: (error: unknown) => {
        this.failed.set(true);
        if (!this.store.expired()) this.toast.showError(error);
      },
    });
  }

  close(event?: Event): void {
    event?.preventDefault();
    if (this.form()?.saving()) return;
    this.dialog().nativeElement.close();
    this.dismissed.emit();
  }
}
