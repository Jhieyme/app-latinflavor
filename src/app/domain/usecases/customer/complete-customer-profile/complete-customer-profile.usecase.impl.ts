import { Injectable, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { CompleteCustomerProfile } from '../../../models/customer/customer';
import { CustomerRepository } from '../../../repository/customer/customer.repository';
import { CompleteCustomerProfileUseCase } from './complete-customer-profile.usecase';

@Injectable()
export class CompleteCustomerProfileUseCaseImpl extends CompleteCustomerProfileUseCase {
  private readonly repository = inject(CustomerRepository);
  override execute(id: string, userId: string, profile: CompleteCustomerProfile) { return this.repository.update(id, profile).pipe(switchMap(() => this.repository.getByUserId(userId))); }
}
