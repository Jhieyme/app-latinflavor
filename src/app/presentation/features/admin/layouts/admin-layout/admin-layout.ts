import { AdminAccountMenu } from '../../components/admin-account-menu/admin-account-menu';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AdminSideNav } from '../../components/admin-side-nav/admin-side-nav';
import { AdminSessionStore } from '../../login/services/store/admin-session.store';

@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, AdminSideNav, AdminAccountMenu],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  private readonly store = inject(AdminSessionStore);
  private readonly router = inject(Router);
  readonly username = computed(() => this.store.session()?.username ?? 'Administrador');
  readonly menuOpen = signal(true);

  signOut(): void {
    this.store.clear();
    void this.router.navigate(['/admin/login'], { replaceUrl: true });
  }
}
