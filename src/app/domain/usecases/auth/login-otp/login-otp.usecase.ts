import { Observable } from "rxjs";

export abstract class LoginOtpUseCase {

  abstract execute(email: string): Observable<void>;
}
