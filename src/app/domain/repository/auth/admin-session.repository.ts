import { PersistedSession } from '../../models/auth/persisted-session';

export abstract class AdminSessionRepository {
  abstract read(): PersistedSession | null;
  abstract save(value: PersistedSession): void;
  abstract clear(): void;
}
