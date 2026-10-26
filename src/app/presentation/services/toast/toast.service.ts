import { errorMessage } from '../../../domain/models/errors/application-error';
import { DestroyRef, Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly kind = signal<'success' | 'error'>('success');
  private readonly currentMessage = signal('');
  private timeout: ReturnType<typeof setTimeout> | undefined;
  readonly message = this.currentMessage.asReadonly();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dismiss());
  }

  showError(error: unknown): void {
    this.show(errorMessage(error), 'error');
  }

  show(message: string, kind: 'success' | 'error' = 'success'): void {
    if (this.message() === message && this.kind() === kind) return;
    this.dismiss();
    if (!message.trim()) return;

    this.kind.set(kind);
    this.currentMessage.set(message);
    this.timeout = setTimeout(() => this.dismiss(), kind === 'error' ? 8000 : 5000);
  }

  dismiss(): void {
    clearTimeout(this.timeout);
    this.timeout = undefined;
    this.currentMessage.set('');
  }
}
