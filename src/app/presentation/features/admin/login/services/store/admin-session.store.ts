import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { AdminSessionRepository } from '../../../../../../domain/repository/auth/admin-session.repository';
import { PERMISSIONS } from '../../../../../../domain/models/auth/permissions';
import { AuthSession } from '../../../../../../domain/models/auth/auth-session';
import { canManageUser, UserInternalAction } from '../../../../../../domain/models/auth/user-internal-authorization';

@Injectable({ providedIn: 'root' })
export class AdminSessionStore {
  private readonly persistence = inject(AdminSessionRepository);
  private expiresAt = 0;
  private timeout: ReturnType<typeof setTimeout> | undefined;
  private readonly expiration = signal(false);
  readonly expired = this.expiration.asReadonly();
  private readonly currentSession = signal<AuthSession | null>(null);
  readonly session = this.currentSession.asReadonly();

  constructor() {
    const saved = this.persistence.read();
    if (saved) {
      this.expiresAt = saved.expiresAt;
      this.currentSession.set(saved.session);
      if (!saved.session || this.expiresAt <= Date.now()) this.expire();
      else this.scheduleExpiration();
    }
    const check = () => { this.checkExpiration(); };
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

  accessToken(): string | undefined {
    this.checkExpiration();
    return this.currentSession()?.accessToken;
  }

  private checkExpiration(): void {
    if (this.currentSession() && Date.now() >= this.expiresAt) this.expire();
  }

  private scheduleExpiration(): void {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.checkExpiration();
      if (this.currentSession()) this.scheduleExpiration();
    }, Math.min(Math.max(0, this.expiresAt - Date.now()), 2_147_483_647));
  }

  expire(): void {
    clearTimeout(this.timeout);
    this.currentSession.set(null);
    this.expiration.set(true);
    this.persistence.save({ session: null, expiresAt: this.expiresAt || Date.now() });
  }

  hasPermission(permission: string): boolean {
    const session = this.currentSession();
    if (!session?.accessToken) return false;
    return session.permissions.includes(PERMISSIONS.ACCESS_MANAGEMENT)
      || session.permissions.includes(permission);
  }

  canManageUser(action: UserInternalAction): boolean {
    return Date.now() < this.expiresAt && canManageUser(this.currentSession(), action);
  }

  authenticate(session: AuthSession): void {
    this.expiresAt = Date.now() + session.expiresIn * 1000;
    this.expiration.set(false);
    this.currentSession.set(session);
    this.persistence.save({ session, expiresAt: this.expiresAt });
    this.scheduleExpiration();
  }

  clear(): void {
    clearTimeout(this.timeout);
    this.expiresAt = 0;
    this.expiration.set(false);
    this.persistence.clear();
    this.currentSession.set(null);
  }
}
