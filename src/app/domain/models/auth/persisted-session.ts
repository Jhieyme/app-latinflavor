import { AuthSession } from './auth-session';

export interface PersistedSession {
  readonly session: AuthSession | null;
  readonly expiresAt: number;
}
