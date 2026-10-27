import { DocumentType } from '../../domain/models/customer/customer';

export interface CustomerResponse {
  readonly id: string;
  readonly userId: string;
  readonly firstName: string | null;
  readonly paternalLastName: string | null;
  readonly maternalLastName: string | null;
  readonly email: string;
  readonly phoneNumber: string | null;
  readonly documentType: DocumentType | null;
  readonly documentNumber: string | null;
  readonly birthDate: string | null;
  readonly isActive: boolean;
  readonly profileCompleted: boolean;
}
