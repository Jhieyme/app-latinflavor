import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserSessionStore } from '../../../login-otp/services/store/user-session.store';

@Component({
  selector: 'app-user-home-welcome',
  imports: [RouterLink],
  templateUrl: './home-welcome.html',
  styleUrl: './home-welcome.css',
})
export class HomeWelcome {
  private readonly userSessionStore = inject(UserSessionStore);
  private readonly router = inject(Router);
  private readonly navigationName = this.router.currentNavigation()?.extras.state?.['userName'] as string | undefined;

  readonly loginRoute = '/user/login-otp';
  readonly reservationNotice = signal(false);
  readonly userName = computed(() => this.getFirstName(
    this.userSessionStore.profile()?.name ?? this.navigationName ?? '',
  ));

  showReservationNotice(): void {
    this.reservationNotice.set(true);
  }

  private getFirstName(fullName: string): string {
    return fullName.trim().split(/\s+/)[0] ?? '';
  }
}
