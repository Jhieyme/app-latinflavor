import { Injectable } from '@angular/core';
import { mapAuthSession } from '../../mappers/auth-session.mapper';
import { AdminSessionRepository } from '../../../domain/repository/auth/admin-session.repository';
import { PersistedSession } from '../../../domain/models/auth/persisted-session';

@Injectable()
export class AdminSessionRepositoryImpl extends AdminSessionRepository {
  private readonly key = 'latin-flavor.admin-session.v1';

  override read(): PersistedSession | null {
    try {
      const raw = sessionStorage.getItem(this.key);
      if (!raw) return null;
      const value = JSON.parse(raw);
      const session = value?.session;
      if (typeof value?.expiresAt !== 'number' || !Number.isFinite(value.expiresAt)
        || (session !== null && (!session || typeof session.accessToken !== 'string'
          || !session.accessToken || typeof session.expiresIn !== 'number'
          || !Number.isFinite(session.expiresIn) || session.expiresIn <= 0
          || !Array.isArray(session.permissions)
          || !session.permissions.every((permission: unknown) => typeof permission === 'string')))) {
        this.clear();
        return null;
      }
      return {
        expiresAt: value.expiresAt,
        session: session ? {
          ...mapAuthSession(session),
          username: typeof session.username === 'string' ? session.username : undefined,
        } : null,
      };
    } catch {
      this.clear();
      return null;
    }
  }

  override save(value: PersistedSession): void {
    try {
      sessionStorage.setItem(this.key, JSON.stringify(value));
    } catch {
      /* Keep the in-memory session if storage is unavailable. */
    }
  }

  override clear(): void {
    try {
      sessionStorage.removeItem(this.key);
    } catch {
      /* Storage may be disabled. */
    }
  }
}
