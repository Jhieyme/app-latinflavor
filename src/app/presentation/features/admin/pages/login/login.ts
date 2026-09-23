import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ADMIN_LOGIN_DEMO, AdminAuthService } from '../../services/admin-auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class AdminLogin {
  private readonly auth = inject(AdminAuthService);
  readonly demo = ADMIN_LOGIN_DEMO;
  readonly busy = signal(false);
  readonly showPassword = signal(false);
  readonly error = signal('');
  readonly success = signal(false);
  username = '';
  password = '';

  async submit(): Promise<void> {
    if (this.busy()) return;
    this.error.set('');
    if (!this.username.trim() || !this.password) {
      this.error.set('Ingresa tu usuario y contraseña.');
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.login(this.username.trim(), this.password);
      this.success.set(true);
      this.password = '';
      this.showPassword.set(false);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No pudimos iniciar sesión. Inténtalo nuevamente.');
    } finally {
      this.busy.set(false);
    }
  }

  reset(): void {
    this.success.set(false);
    this.error.set('');
    this.password = '';
    this.showPassword.set(false);
  }
}
