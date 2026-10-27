import { Customer } from '../../../../../../domain/models/customer/customer';
import { DestroyRef, Injectable, computed, inject, signal } from '@angular/core';
import { AuthSession } from '../../../../../../domain/models/auth/auth-session';

@Injectable({ providedIn: 'root' })
export class UserSessionStore {
  readonly email = signal('');
  private readonly currentSession = signal<AuthSession | null>(null);
  private readonly currentProfile = signal<Customer | null>(null);
  private readonly expiration = signal(false);
  readonly session = this.currentSession.asReadonly();
  readonly profile = this.currentProfile.asReadonly();
  readonly expired = this.expiration.asReadonly();
  readonly signedIn = computed(() => !!this.session()?.accessToken && this.profile()?.profileCompleted === true);
  private expiresAt = 0;
  private timeout: ReturnType<typeof setTimeout> | undefined;

  constructor() {
    const check = () => this.checkExpiration();
    if (typeof window !== 'undefined') {
      window.addEventListener('focus', check);
      document.addEventListener('visibilitychange', check);
      inject(DestroyRef).onDestroy(() => {
        clearTimeout(this.timeout);
        window.removeEventListener('focus', check);
        document.removeEventListener('visibilitychange', check);
      });
    }
  }

  start(email: string): void {
    this.clear();
    this.email.set(email);
  }

  authenticate(session: AuthSession): void {
    clearTimeout(this.timeout);
    this.expiration.set(false);
    this.currentProfile.set(null);
    this.currentSession.set(session);
    this.expiresAt = Date.now() + session.expiresIn * 1000;
    this.checkExpiration();
    if (this.session()) this.scheduleExpiration();
  }

  accessToken(): string | undefined {
    this.checkExpiration();
    return this.session()?.accessToken;
  }

  setProfile(profile: Customer): void {
    this.checkExpiration();
    if (this.session()?.userId === profile.userId) this.currentProfile.set(profile);
  }

  private checkExpiration(): void {
    if (this.session() && Date.now() >= this.expiresAt) this.expire();
  }

  private scheduleExpiration(): void {
    this.timeout = setTimeout(() => {
      this.checkExpiration();
      if (this.session()) this.scheduleExpiration();
    }, Math.min(Math.max(0, this.expiresAt - Date.now()), 2_147_483_647));
  }

  expire(): void {
    const notify = this.signedIn();
    clearTimeout(this.timeout);
    this.currentSession.set(null);
    this.currentProfile.set(null);
    this.expiresAt = 0;
    if (notify) this.expiration.set(true);
  }

  clear(): void {
    this.expire();
    this.expiration.set(false);
    this.email.set('');
  }
}
