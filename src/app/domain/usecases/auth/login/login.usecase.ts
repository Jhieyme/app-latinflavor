import { Observable } from 'rxjs';
import { AuthSession } from '../../../models/auth/auth-session';

export abstract class LoginUseCase {
  abstract execute(username: string, password: string): Observable<AuthSession>;
}
