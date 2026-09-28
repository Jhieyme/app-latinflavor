import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationError } from '../../domain/models/errors/application-error';
import { IDENTITY_ERROR_MESSAGES } from '../constants/error-messages';

export function mapIdentityError(
  error: HttpErrorResponse,
  method: string,
  url: string,
  body: unknown,
): ApplicationError {
  let payload: unknown = error.error;
  if (typeof payload === 'string') {
    try {
      payload = JSON.parse(payload);
    } catch {
      payload = null;
    }
  }
  const code =
    payload &&
    typeof payload === 'object' &&
    'exceptionName' in payload &&
    typeof payload.exceptionName === 'string'
      ? payload.exceptionName
      : null;
  const path = url.split('?')[0];
  const signingIn = path.endsWith('/sign-in');
  const generatingCode = path.endsWith('/generate-code');
  const otp = body !== null && typeof body === 'object' && 'type' in body && body.type === 'OTP';
  const mutation = method !== 'GET' && /\/users(?:\/|$)/.test(path);

  let message =
    code && Object.hasOwn(IDENTITY_ERROR_MESSAGES, code) ? IDENTITY_ERROR_MESSAGES[code] : '';
  if (signingIn && (code === 'ROLE_NOT_FOUND' || code === 'PERMISSION_NOT_FOUND')) {
    message = 'No pudimos habilitar el acceso a tu cuenta. Contacta con administración.';
  }
  if (generatingCode && error.status >= 500)
    message = 'No pudimos enviar el código a tu correo. Inténtalo más tarde.';
  if (!message) {
    if (error.status === 0 || error.status >= 500) {
      message = mutation
        ? 'No se pudo confirmar la operación. Actualiza la lista antes de reintentar.'
        : error.status === 0
          ? 'No pudimos conectar con el servidor. Inténtalo nuevamente.'
          : 'El servicio no está disponible en este momento.';
    } else if (error.status === 401) {
      message = signingIn
        ? otp
          ? 'El código no es válido o ha vencido.'
          : IDENTITY_ERROR_MESSAGES['INVALID_CREDENTIALS']
        : IDENTITY_ERROR_MESSAGES['INVALID_TOKEN'];
    } else if (error.status === 403) message = IDENTITY_ERROR_MESSAGES['AccessDeniedException'];
    else if (error.status === 400 || error.status === 422)
      message = IDENTITY_ERROR_MESSAGES['INVALID_REQUEST'];
    else if (error.status === 404) message = 'No se encontró el recurso solicitado.';
    else if (error.status === 409)
      message = 'La operación entra en conflicto con los datos actuales. Revisa la información.';
    else if (error.status === 429)
      message = 'Has realizado demasiadas solicitudes. Espera un momento.';
    else message = 'No pudimos completar la solicitud. Inténtalo nuevamente.';
  }
  return new ApplicationError(message, error.status, code, error);
}
