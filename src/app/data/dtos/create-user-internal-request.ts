export interface CreateUserInternalRequest {
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly role: 'INTERNAL' | 'ADMIN';
  readonly firstName: string;
  readonly paternalLastName: string;
  readonly maternalLastName: string;
  readonly phoneNumber: string;
  readonly dni: string;
  readonly permissions: readonly string[];
}
