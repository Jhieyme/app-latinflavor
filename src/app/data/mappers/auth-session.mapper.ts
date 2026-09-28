import { AuthSession } from '../../domain/models/auth/auth-session';
import { SignInResponse } from '../dtos/sign-in-response';

export function mapAuthSession(response: SignInResponse): AuthSession {

  let claims: Record<string, unknown> = {};

  try {
    const payload = response.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const decoded: unknown = JSON.parse(
      new TextDecoder().decode(
        Uint8Array.from(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, '=')), (c) =>
          c.charCodeAt(0),
        ),
      ),
    );
    if (decoded && typeof decoded === 'object' && !Array.isArray(decoded))
      claims = decoded as Record<string, unknown>;
  } catch {
  }

  const value = response.roles ?? response.role ?? claims['roles'] ?? claims['role'];
  const roles =
    typeof value === 'string'
      ? [value]
      : Array.isArray(value)
        ? value.filter((role): role is string => typeof role === 'string')
        : [];
  return {
    accessToken: response.accessToken,
    expiresIn: response.expiresIn,
    permissions: response.permissions,
    roles,
  };
}
