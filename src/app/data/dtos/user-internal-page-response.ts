import { UserInternalResponse } from './user-internal-response';

export interface UserInternalPageResponse {
  readonly content: readonly UserInternalResponse[];
  readonly page: number;
  readonly size: number;
  readonly totalElements: number;
  readonly totalPages: number;
}
