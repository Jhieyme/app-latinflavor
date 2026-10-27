import { Injectable, inject } from '@angular/core';
import { CompleteCustomerProfile } from '../../../../../../domain/models/customer/customer';
import { GetCustomerUseCase } from '../../../../../../domain/usecases/customer/get-customer/get-customer.usecase';
import { CompleteCustomerProfileUseCase } from '../../../../../../domain/usecases/customer/complete-customer-profile/complete-customer-profile.usecase';

@Injectable()
export class CustomerProfileFacade {
  private readonly getCustomer = inject(GetCustomerUseCase);
  private readonly completeCustomer = inject(CompleteCustomerProfileUseCase);
  get(userId: string) { return this.getCustomer.execute(userId); }
  complete(id: string, userId: string, profile: CompleteCustomerProfile) {
    return this.completeCustomer.execute(id, userId, profile);
  }
}
