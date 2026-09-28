export interface UpdateUserAccess {
  readonly role: 'ADMIN' | 'INTERNAL';
  readonly permissions: readonly string[];
}
