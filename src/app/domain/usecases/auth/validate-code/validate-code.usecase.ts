import { Observable } from 'rxjs';
import { AuthSession } from '../../../models/auth/auth-session';

export abstract class ValidateCodeUseCase {
  abstract execute(email: string, code: string): Observable<AuthSession>;
}
