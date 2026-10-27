import { CustomerProfileFacade } from './login-otp/services/facades/customer-profile-facade';
import { CustomerRepository } from '../../../domain/repository/customer/customer.repository';
import { CustomerRepositoryImpl } from '../../../data/services/customer/customer.repository.impl';
import { GetCustomerUseCase } from '../../../domain/usecases/customer/get-customer/get-customer.usecase';
import { GetCustomerUseCaseImpl } from '../../../domain/usecases/customer/get-customer/get-customer.usecase.impl';
import { CompleteCustomerProfileUseCase } from '../../../domain/usecases/customer/complete-customer-profile/complete-customer-profile.usecase';
import { CompleteCustomerProfileUseCaseImpl } from '../../../domain/usecases/customer/complete-customer-profile/complete-customer-profile.usecase.impl';
import { Provider } from '@angular/core';

export const CUSTOMER_PROVIDERS: Provider[] = [
  CustomerProfileFacade,
  { provide: CustomerRepository, useClass: CustomerRepositoryImpl },
  { provide: GetCustomerUseCase, useClass: GetCustomerUseCaseImpl },
  { provide: CompleteCustomerProfileUseCase, useClass: CompleteCustomerProfileUseCaseImpl },
];
