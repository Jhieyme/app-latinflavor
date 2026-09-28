import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthRepository } from "../../../domain/repository/auth/auth.repository";
import { Observable, map } from "rxjs";
import { mapAuthSession } from '../../mappers/auth-session.mapper';
import { ApiManifest } from "../../constants/api-manifest";
import { AuthSession } from '../../../domain/models/auth/auth-session';

import { SignInResponse } from '../../dtos/sign-in-response';

@Injectable()
export class AuthRepositoryImpl extends AuthRepository {

  constructor(private readonly http: HttpClient) {
    super();
  }

  override generateCode(email: string): Observable<void> {
    return this.http.post<void>(ApiManifest.IDENTITY.GENERATE_CODE, { email });
  }

  override signIn(username: string, password: string): Observable<AuthSession> {
    return this.http.post<SignInResponse>(ApiManifest.IDENTITY.TOKEN, {
      type: 'USERNAME_PASSWORD',
      username,
      password,
    }).pipe(map(response => ({ ...mapAuthSession(response), username })));
  }

  override validateCode(email: string, code: string): Observable<AuthSession> {
    return this.http.post<SignInResponse>(ApiManifest.IDENTITY.TOKEN, {
      type: 'OTP',
      email,
      code,
    }).pipe(map(mapAuthSession));
  }

}
