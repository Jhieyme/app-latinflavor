import { DestroyRef, Injectable, inject, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly currentMessage = signal('');
  private timeout: ReturnType<typeof setTimeout> | undefined;
  readonly message = this.currentMessage.asReadonly();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.dismiss());
  }

  show(message: string): void {
    this.dismiss();
    if (!message.trim()) return;

    this.currentMessage.set(message);
    this.timeout = setTimeout(() => this.dismiss(), 5000);
  }

  dismiss(): void {
    clearTimeout(this.timeout);
    this.timeout = undefined;
    this.currentMessage.set('');
  }
}
