import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { CustomerRepository } from '../../../domain/repository/customer/customer.repository';
import { CompleteCustomerProfile } from '../../../domain/models/customer/customer';
import { CustomerResponse } from '../../dtos/customer-response';
import { UpdateCustomerRequest } from '../../dtos/update-customer-request';
import { ApiManifest } from '../../constants/api-manifest';

@Injectable()
export class CustomerRepositoryImpl extends CustomerRepository {
  private readonly http = inject(HttpClient);

  override getByUserId(userId: string) {
    return this.http.get<CustomerResponse>(`${ApiManifest.CUSTOMER.CUSTOMER}/me/${encodeURIComponent(userId)}`);
  }

  override update(id: string, profile: CompleteCustomerProfile) {
    const request: UpdateCustomerRequest = { ...profile };
    return this.http.put(`${ApiManifest.CUSTOMER.CUSTOMER}/${encodeURIComponent(id)}`, request,
      { responseType: 'text' }).pipe(map(() => undefined));
  }
}
