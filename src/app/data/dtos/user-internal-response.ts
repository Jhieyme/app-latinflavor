export interface UserInternalResponse {
  readonly id: string;
  readonly username: string;
  readonly firstName: string;
  readonly paternalLastName: string;
  readonly maternalLastName: string;
  readonly email: string;
  readonly phoneNumber: string;
  readonly dni: string;
  readonly employeeCode: string | null;
  readonly active: boolean;
  readonly roles: string[];
  readonly permissions: string[];
}
