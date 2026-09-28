import { AuthSession } from './auth-session';
import { PERMISSIONS } from './permissions';

export type UserInternalAction = 'read' | 'create' | 'update' | 'access' | 'disable';

const actionPermissions: Record<UserInternalAction, string> = {
  read: PERMISSIONS.READ_USER,
  create: PERMISSIONS.CREATE_USER,
  update: PERMISSIONS.UPDATE_USER,
  access: PERMISSIONS.MANAGE_USER_ACCESS,
  disable: PERMISSIONS.DISABLE_USER,
};

export function canManageUser(session: AuthSession | null, action: UserInternalAction): boolean {
  if (!session?.accessToken) return false;
  const roles = session.roles ?? [];
  const hasRole = roles.includes('ADMIN') || (action === 'read' && roles.includes('INTERNAL'));
  return hasRole && [actionPermissions[action], PERMISSIONS.USER_MANAGEMENT, PERMISSIONS.ACCESS_MANAGEMENT]
    .some(permission => session.permissions.includes(permission));
}
