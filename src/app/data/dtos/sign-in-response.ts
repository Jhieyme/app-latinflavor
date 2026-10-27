export interface SignInResponse {
  readonly roles?: string[];
  readonly role?: string;
  readonly userId: string;
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly permissions: string[];
}
