export interface UpdateUserInternalRequest {
  readonly firstName: string;
  readonly paternalLastName: string;
  readonly maternalLastName: string;
  readonly phoneNumber: string;
  readonly dni: string;
  readonly active: boolean;
}
