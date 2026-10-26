import { UserInternal } from './user-internal';

export type UserSearchField = 'username' | 'firstName' | 'paternalLastName' | 'maternalLastName'
  | 'email' | 'phoneNumber' | 'dni' | 'employeeCode' | 'active';
export type UserSortField = UserSearchField;
export type SortDirection = 'asc' | 'desc';

export interface SearchUserInternal {
  readonly q: string;
  readonly filters: readonly UserSearchField[];
  readonly page: number;
  readonly size: number;
  readonly sort: UserSortField;
  readonly direction: SortDirection;
}

export interface UserInternalPageResult {
  readonly users: readonly UserInternal[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
}
