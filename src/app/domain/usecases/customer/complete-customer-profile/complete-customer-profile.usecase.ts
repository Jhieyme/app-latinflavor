import { Observable } from 'rxjs';
import { Customer, CompleteCustomerProfile } from '../../../models/customer/customer';

export abstract class CompleteCustomerProfileUseCase {
  abstract execute(id: string, userId: string, profile: CompleteCustomerProfile): Observable<Customer>;
}
