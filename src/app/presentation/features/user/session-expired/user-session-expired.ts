import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UserSessionStore } from '../login-otp/services/store/user-session.store';

@Component({
  selector: 'app-user-session-expired',
  templateUrl: './user-session-expired.html',
  styleUrl: './user-session-expired.css',
})
export class UserSessionExpired {
  private readonly store = inject(UserSessionStore);
  private readonly router = inject(Router);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const expired = this.store.expired();
      const dialog = this.dialog()?.nativeElement;
      if (!dialog) return;
      if (expired && !dialog.open) dialog.showModal();
      if (!expired && dialog.open) dialog.close();
    });
  }

  accept(): void {
    this.store.clear();
    void this.router.navigate(['/user/login-otp'], { replaceUrl: true });
  }
}
