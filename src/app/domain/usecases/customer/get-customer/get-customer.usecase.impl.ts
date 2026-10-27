import { Injectable, inject } from '@angular/core';
import { CustomerRepository } from '../../../repository/customer/customer.repository';
import { GetCustomerUseCase } from './get-customer.usecase';

@Injectable()
export class GetCustomerUseCaseImpl extends GetCustomerUseCase {
  private readonly repository = inject(CustomerRepository);
  override execute(userId: string) { return this.repository.getByUserId(userId); }
}
