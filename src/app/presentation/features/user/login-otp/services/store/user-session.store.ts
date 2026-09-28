import { Injectable, signal } from '@angular/core';
import { AuthSession } from '../../../../../../domain/models/auth/auth-session';

export interface UserProfile {
  readonly name: string;
  readonly email: string;
  readonly phone: string;
}

@Injectable({ providedIn: 'root' })
export class UserSessionStore {
  readonly email = signal('');
  readonly session = signal<AuthSession | null>(null);
  readonly profile = signal<UserProfile | null>(null);

  start(email: string): void {
    this.email.set(email);
    this.session.set(null);
    this.profile.set(null);
  }

  authenticate(session: AuthSession): void {
    this.session.set(session);
  }

  completeProfile(profile: UserProfile): void {
    this.profile.set(profile);
  }
}
