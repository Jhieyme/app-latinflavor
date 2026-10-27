import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationError } from '../../domain/models/errors/application-error';
import { CUSTOMER_ERROR_MESSAGES, CUSTOMER_HTTP_ERROR_MESSAGES, CUSTOMER_ERROR_FALLBACK } from '../constants/customer-error-messages';
import { readExceptionCode } from '../errors/read-exception-code';

function isCustomerErrorCode(code: string): code is keyof typeof CUSTOMER_ERROR_MESSAGES {
  return Object.hasOwn(CUSTOMER_ERROR_MESSAGES, code);
}

export function mapCustomerError(error: HttpErrorResponse): ApplicationError {
  const code = readExceptionCode(error.error);
  const message = code && isCustomerErrorCode(code) ? CUSTOMER_ERROR_MESSAGES[code]
    : CUSTOMER_HTTP_ERROR_MESSAGES[error.status] ?? CUSTOMER_ERROR_FALLBACK;
  return new ApplicationError(message, error.status, code, error);
}
