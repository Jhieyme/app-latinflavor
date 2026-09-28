import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { UserInternalRepository } from '../../../domain/repository/user-internal/user-internal.repository';
import { UserInternal } from '../../../domain/models/user-internal/user-internal';
import { UserInternalResponse } from '../../dtos/user-internal-response';
import { ApiManifest } from '../../constants/api-manifest';
import { UpdateUserInternal } from '../../../domain/models/user-internal/update-user-internal';
import { UpdateUserAccess } from '../../../domain/models/user-internal/update-user-access';
import { UpdateUserInternalRequest } from '../../dtos/update-user-internal-request';
import { UpdateUserAccessRequest } from '../../dtos/update-user-access-request';
import { CreateUserInternal } from '../../../domain/models/user-internal/create-user-internal';
import { CreateUserInternalRequest } from '../../dtos/create-user-internal-request';

@Injectable()
export class UserInternalRepositoryImpl extends UserInternalRepository {
  constructor(private readonly http: HttpClient) { super(); }

  override updateInfo(id: string, value: UpdateUserInternal): Observable<void> {
    const request: UpdateUserInternalRequest = {
      firstName: value.firstName, paternalLastName: value.paternalLastName,
      maternalLastName: value.maternalLastName, phoneNumber: value.phoneNumber, dni: value.dni,
      active: value.active,
    };
    return this.http.put(`${ApiManifest.IDENTITY.USER}/${encodeURIComponent(id)}`, request,
      { responseType: 'text' }).pipe(map(() => undefined));
  }

  override updateAccess(id: string, value: UpdateUserAccess): Observable<void> {
    const request: UpdateUserAccessRequest = { role: value.role, permissions: [...value.permissions] };
    return this.http.patch(`${ApiManifest.IDENTITY.USER}/${encodeURIComponent(id)}/access`, request,
      { responseType: 'text' }).pipe(map(() => undefined));
  }

  override disable(id: string): Observable<void> {
    return this.http.delete(`${ApiManifest.IDENTITY.USER}/${encodeURIComponent(id)}/disable`,
      { responseType: 'text' }).pipe(map(() => undefined));
  }

  override create(user: CreateUserInternal): Observable<void> {
    const request: CreateUserInternalRequest = { ...user, permissions: [...user.permissions] };
    return this.http.post(ApiManifest.IDENTITY.USER, request, { responseType: 'text' }).pipe(map(() => undefined));
  }

  override getById(id: string): Observable<UserInternal> {
    return this.http.get<UserInternalResponse>(`${ApiManifest.IDENTITY.USER}/${encodeURIComponent(id)}`).pipe(
      map(user => ({ ...user, roles: [...(user.roles ?? [])], permissions: [...(user.permissions ?? [])] })),
    );
  }

  override getAll(): Observable<readonly UserInternal[]> {
    return this.http.get<UserInternalResponse[]>(ApiManifest.IDENTITY.USER).pipe(
      map(users => users.map(user =>
        ({ ...user,
          roles: [...(user.roles ?? [])],
          permissions: [...user.permissions]
        }))),
    );
  }
}
