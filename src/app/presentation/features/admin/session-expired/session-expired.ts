import { Component, ElementRef, effect, inject, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AdminSessionStore } from '../login/services/store/admin-session.store';

@Component({
  selector: 'app-session-expired',
  templateUrl: './session-expired.html',
  styleUrl: './session-expired.css',
})
export class SessionExpired {
  private readonly store = inject(AdminSessionStore);
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
    void this.router.navigate(['/admin/login'], { replaceUrl: true });
  }
}
