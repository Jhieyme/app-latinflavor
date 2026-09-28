import { errorMessage } from '../../../../../../domain/models/errors/application-error';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, map, timer, takeWhile } from 'rxjs';
import { LoginOtpFacade } from '../../services/facades/login-otp-facade';
import { CompleteProfile } from '../../components/complete-profile/complete-profile';
import { ValidateCodeFacade } from '../../services/facades/validate-code-facade';
import { UserSessionStore } from '../../services/store/user-session.store';
import { ToastService } from '../../../../../services/toast/toast.service';

@Component({
  selector: 'app-validate-code',
  imports: [FormsModule, RouterLink, CompleteProfile],
  templateUrl: './validate-code.html',
  styleUrl: './validate-code.css',
})
export class ValidateCode {
  private readonly toast = inject(ToastService);
  private readonly loginOtpFacade = inject(LoginOtpFacade);
  private readonly validateCodeFacade = inject(ValidateCodeFacade);
  private readonly userSessionStore = inject(UserSessionStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  readonly email = this.userSessionStore.email;
  readonly session = this.userSessionStore.session;
  readonly loading = signal(false);
  readonly resending = signal(false);
  readonly resendSeconds = signal(0);
  readonly errorMessage = signal('');
  readonly codeFocused = signal(false);
  readonly codePositions = [0, 1, 2, 3, 4, 5] as const;
  code = '';

  constructor() {
    if (!this.email()) void this.router.navigate(['/user/login-otp']);
  }

  updateCode(value: string): void {
    this.code = value.replace(/\D/g, '').slice(0, 6);
    this.errorMessage.set('');
  }

  codeDigit(position: number): string {
    return this.code[position] ?? '';
  }

  isActivePosition(position: number): boolean {
    return this.codeFocused() && position === Math.min(this.code.length, 5);
  }

  submit(): void {
    if (this.loading() || this.resending() || this.session() || !/^\d{6}$/.test(this.code) || !this.email()) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.validateCodeFacade.execute(this.email(), this.code)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: session => {
          this.userSessionStore.authenticate(session);
          this.code = '';
        },
        error: error => this.errorMessage.set(errorMessage(error)),
      });
  }

  resendCode(): void {
    if (this.resending() || this.loading() || this.resendSeconds() > 0 || this.session() || !this.email()) return;

    this.resending.set(true);
    this.errorMessage.set('');

    this.loginOtpFacade.execute(this.email())
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.resending.set(false)),
      )
      .subscribe({
        next: () => {
          this.code = '';
          this.toast.show('Enviamos un nuevo código a tu correo.');
          this.resendSeconds.set(59);
          const availableAt = Date.now() + 59_000;

          timer(1000, 1000)
            .pipe(
              map(() => Math.max(0, Math.ceil((availableAt - Date.now()) / 1000))),
              takeWhile(seconds => seconds > 0 && !this.session(), true),
              takeUntilDestroyed(this.destroyRef),
            )
            .subscribe(seconds => {
              this.resendSeconds.set(seconds);
            });
        },
        error: (error: unknown) => { this.errorMessage.set(errorMessage(error)); },
      });
  }

}
