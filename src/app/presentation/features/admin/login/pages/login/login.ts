import { AppInput } from '../../../../shared/input/input';
import { errorMessage } from '../../../../../../domain/models/errors/application-error';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { LoginFacade } from '../../services/facades/login-facade';
import { AdminSessionStore } from '../../services/store/admin-session.store';

@Component({
  selector: 'app-admin-login',
  imports: [AppInput, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class AdminLogin {
  private readonly loginFacade = inject(LoginFacade);
  private readonly store = inject(AdminSessionStore);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  constructor() {
    if (this.store.accessToken()) {
      void this.router.navigate(['/admin/user-internal']);
    }
  }

  readonly session = this.store.session;
  readonly loading = signal(false);
  readonly passwordVisible = signal(false);
  readonly errorMessage = signal('');
  username = '';
  password = '';

  submit(): void {
    const username = this.username.trim();
    if (this.loading() || this.session() || !username || !this.password) return;

    this.loading.set(true);
    this.errorMessage.set('');
    this.loginFacade.execute(username, this.password)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: session => {
          this.password = '';
          this.passwordVisible.set(false);
          this.store.authenticate(session);
          void this.router.navigate(['/admin/user-internal']);
        },
        error: (error: unknown) => this.errorMessage.set(errorMessage(error)),
      });
  }

  signOut(): void {
    this.store.clear();
    this.password = '';
    this.errorMessage.set('');
  }

}
