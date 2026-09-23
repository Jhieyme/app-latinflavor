import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { OtpChallenge, OtpService } from '../../services/otp.service';

@Component({
  selector: 'app-user-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly otpService = inject(OtpService);
  readonly demoCode = this.otpService.demoCode;
  readonly step = signal<'email' | 'code' | 'success'>('email');
  readonly busy = signal(false);
  readonly error = signal('');
  readonly notice = signal('');
  readonly challenge = signal<OtpChallenge | null>(null);
  readonly now = signal(Date.now());
  readonly resendSeconds = computed(() => Math.max(0, Math.ceil(((this.challenge()?.resendAt ?? 0) - this.now()) / 1000)));
  readonly expiresSeconds = computed(() => Math.max(0, Math.ceil(((this.challenge()?.expiresAt ?? 0) - this.now()) / 1000)));
  readonly remaining = computed(() => {
    const seconds = this.expiresSeconds();
    return Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
  });
  email = '';
  code = '';
  sentEmail = '';

  constructor() {
    const timer = setInterval(() => this.now.set(Date.now()), 1000);
    inject(DestroyRef).onDestroy(() => clearInterval(timer));
  }

  async sendCode(): Promise<void> {
    if (this.busy() || (this.step() === 'code' && this.resendSeconds() > 0)) return;
    const email = (this.step() === 'code' ? this.sentEmail : this.email).trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error.set('Ingresa un correo electrónico válido.');
      return;
    }
    this.busy.set(true);
    this.error.set('');
    this.notice.set('');
    try {
      const challenge = await this.otpService.requestCode(email);
      this.challenge.set(challenge);
      this.now.set(Date.now());
      this.sentEmail = email;
      this.code = '';
      this.step.set('code');
      this.notice.set('Código de prueba listo. No se envió ningún correo.');
    } catch {
      this.error.set('No pudimos enviar el código. Inténtalo nuevamente.');
    } finally {
      this.busy.set(false);
    }
  }

  async verifyCode(): Promise<void> {
    if (this.busy() || !this.challenge()) return;
    this.error.set('');
    if (!/^\d{6}$/.test(this.code)) {
      this.error.set('Ingresa los 6 dígitos del código.');
      return;
    }
    this.busy.set(true);
    try {
      await this.otpService.verifyCode(this.sentEmail, this.code, this.challenge()!.id);
      this.step.set('success');
      this.code = '';
      this.notice.set('');
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No pudimos validar el código. Inténtalo nuevamente.');
    } finally {
      this.busy.set(false);
    }
  }

  changeEmail(): void {
    if (this.busy()) return;
    this.step.set('email');
    this.challenge.set(null);
    this.code = '';
    this.error.set('');
    this.notice.set('');
  }
}
