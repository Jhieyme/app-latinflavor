export type DocumentType = 'DNI' | 'CE' | 'PASSPORT';

export interface Customer {
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

export interface CompleteCustomerProfile {
  readonly firstName: string;
  readonly paternalLastName: string;
  readonly maternalLastName: string;
  readonly phoneNumber: string;
  readonly documentType: DocumentType;
  readonly documentNumber: string;
  readonly birthDate: string;
}
