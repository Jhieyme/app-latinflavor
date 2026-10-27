import { Observable } from 'rxjs';
import { Customer } from '../../../models/customer/customer';

export abstract class GetCustomerUseCase {
  abstract execute(userId: string): Observable<Customer>;
}
