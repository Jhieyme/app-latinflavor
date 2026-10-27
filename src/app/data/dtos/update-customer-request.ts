import { DocumentType } from '../../domain/models/customer/customer';

export interface UpdateCustomerRequest {
  readonly firstName: string;
  readonly paternalLastName: string;
  readonly maternalLastName: string;
  readonly phoneNumber: string;
  readonly documentType: DocumentType;
  readonly documentNumber: string;
  readonly birthDate: string;
}
