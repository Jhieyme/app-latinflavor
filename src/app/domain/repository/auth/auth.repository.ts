import { Observable } from "rxjs";
import { AuthSession } from '../../models/auth/auth-session';

export abstract class AuthRepository {

  abstract generateCode(email: string): Observable<void>;
  abstract validateCode(email: string, code: string): Observable<AuthSession>;
  abstract signIn(username: string, password: string): Observable<AuthSession>;

}
