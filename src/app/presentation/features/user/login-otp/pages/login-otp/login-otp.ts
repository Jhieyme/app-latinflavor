import { AppInput } from '../../../../shared/input/input';
import { errorMessage } from '../../../../../../domain/models/errors/application-error';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { LoginOtpFacade } from '../../services/facades/login-otp-facade';
import { UserSessionStore } from '../../services/store/user-session.store';

@Component({
  selector: 'app-login-otp',
  imports: [AppInput, FormsModule, RouterLink],
  templateUrl: './login-otp.html',
  styleUrl: './login-otp.css',
})
export class LoginOtp {
  private readonly loginOtpFacade = inject(LoginOtpFacade);
  private readonly userSessionStore = inject(UserSessionStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(false);
  readonly errorMessage = signal('');
  email = '';

  submit(): void {
    const email = this.email.trim().toLowerCase();
    if (this.loading() || !this.isValidEmail(email)) return;

    this.loading.set(true);
    this.errorMessage.set('');

    this.loginOtpFacade.execute(email)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: () => {
          this.email = email;
          this.userSessionStore.start(email);
          void this.router.navigate(['validate-code'], { relativeTo: this.route });
        },
        error: error => this.errorMessage.set(errorMessage(error)),
      });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

}
