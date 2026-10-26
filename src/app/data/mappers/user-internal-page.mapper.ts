import { UserInternalPageResult } from '../../domain/models/user-internal/search-user-internal';
import { UserInternalPageResponse } from '../dtos/user-internal-page-response';

export function mapUserInternalPage(response: UserInternalPageResponse): UserInternalPageResult {
  return {
    users: response.content.map((user) => ({
      ...user,
      roles: [...(user.roles ?? [])],
      permissions: [...(user.permissions ?? [])],
    })),
    page: response.page,
    size: response.size,
    totalElements: response.totalElements,
    totalPages: response.totalPages,
  };
}
