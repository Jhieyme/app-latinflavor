import { MyProfile } from '../../components/my-profile/my-profile';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserSessionStore } from '../../../login-otp/services/store/user-session.store';

@Component({
  selector: 'app-user-home-welcome',
  imports: [RouterLink, MyProfile],
  templateUrl: './home-welcome.html',
  styleUrl: './home-welcome.css',
})
export class HomeWelcome {
  private readonly userSessionStore = inject(UserSessionStore);
  private readonly router = inject(Router);
  readonly signedIn = this.userSessionStore.signedIn;
  readonly profileOpen = signal(false);

  constructor() {
    effect(() => { if (!this.signedIn()) this.profileOpen.set(false); });
  }

  openProfile(): void {
    if (this.userSessionStore.accessToken() && this.signedIn()) this.profileOpen.set(true);
  }

  signOut(): void {
    this.profileOpen.set(false);
    this.userSessionStore.clear();
    void this.router.navigate(['/user/home'], { replaceUrl: true });
  }

  readonly loginRoute = '/user/login-otp';
  readonly reservationNotice = signal(false);
  readonly userName = computed(() => this.userSessionStore.profile()?.firstName?.trim() ?? '');

  showReservationNotice(): void {
    this.reservationNotice.set(true);
  }

}
