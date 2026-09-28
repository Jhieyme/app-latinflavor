export interface UpdateUserAccessRequest {
  readonly role: 'ADMIN' | 'INTERNAL';
  readonly permissions: readonly string[];
}
