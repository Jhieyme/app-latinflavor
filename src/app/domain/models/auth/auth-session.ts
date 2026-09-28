export interface AuthSession {
  readonly username?: string;
  readonly roles?: readonly string[];
  readonly accessToken: string;
  readonly expiresIn: number;
  readonly permissions: readonly string[];
}
