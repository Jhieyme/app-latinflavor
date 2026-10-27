import { Observable } from 'rxjs';
import { Customer, CompleteCustomerProfile } from '../../models/customer/customer';

export abstract class CustomerRepository {
  abstract getByUserId(userId: string): Observable<Customer>;
  abstract update(id: string, profile: CompleteCustomerProfile): Observable<void>;
}
