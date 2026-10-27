import { readExceptionCode } from '../errors/read-exception-code';
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationError } from '../../domain/models/errors/application-error';
import { resolveIdentityErrorMessage } from '../errors/identity-error.resolver';

export function mapIdentityError(
  error: HttpErrorResponse,
  method: string,
  url: string,
  body: unknown,
): ApplicationError {
  const code = readExceptionCode(error.error);
  const message = resolveIdentityErrorMessage({
    status: error.status,
    code,
    method: method.toUpperCase(),
    path: url.split('?')[0],
    isOtp: body !== null && typeof body === 'object' && 'type' in body && body.type === 'OTP',
  });
  return new ApplicationError(message, error.status, code, error);
}
