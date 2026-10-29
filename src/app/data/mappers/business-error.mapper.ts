import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationError } from '../../domain/models/errors/application-error';
import { readExceptionCode } from '../errors/read-exception-code';
import {
  BUSINESS_ERROR_MESSAGES,
  BUSINESS_HTTP_ERRORS,
  BUSINESS_ERROR_FALLBACK,
} from '../constants/business-error-messages';

export function mapBusinessError(error: HttpErrorResponse): ApplicationError {
  const code = readExceptionCode(error.error);
  const message =
    code && Object.hasOwn(BUSINESS_ERROR_MESSAGES, code)
      ? BUSINESS_ERROR_MESSAGES[code]
      : (BUSINESS_HTTP_ERRORS[error.status] ?? BUSINESS_ERROR_FALLBACK);
  return new ApplicationError(message, error.status, code, error);
}
