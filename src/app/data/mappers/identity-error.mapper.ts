import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationError } from '../../domain/models/errors/application-error';
import { resolveIdentityErrorMessage } from '../errors/identity-error.resolver';

function readExceptionCode(payload: unknown): string | null {
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      return null;
    }
  }
  if (
    payload &&
    typeof payload === 'object' &&
    'exceptionName' in payload &&
    typeof payload.exceptionName === 'string'
  ) {
    return payload.exceptionName;
  }
  return null;
}

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
