export const IDENTITY_ERROR_MESSAGES = {
  INVALID_PAGE: 'La página solicitada no es válida.',
  INVALID_PAGE_SIZE: 'La cantidad por página debe estar entre 1 y 100.',
  INVALID_SORT_FORMAT: 'El formato del ordenamiento no es válido.',
  UNSUPPORTED_SORT_FIELD: 'El campo seleccionado no permite ordenar resultados.', 
  USER_EMAIL_ALREADY_EXISTS: 'El correo electrónico ya está registrado.',
  USER_USERNAME_ALREADY_EXISTS: 'El nombre de usuario ya está registrado.',
  USER_DNI_ALREADY_EXISTS: 'El DNI ya está registrado.',
  ROLE_NOT_FOUND: 'El rol no existe o está inactivo.',
  PERMISSION_NOT_FOUND: 'Uno de los permisos no existe o está inactivo.',
  USER_NOT_FOUND: 'No se encontró el usuario solicitado.',
  UNSUPPORTED_USER_SEARCH_FILTER: 'Uno de los filtros de búsqueda no es válido.',
  USER_NOT_INTERNAL: 'El usuario seleccionado no pertenece al personal interno.',
  INVALID_CREDENTIALS: 'Usuario o contraseña incorrectos.',
  INVALID_OTP_CODE: 'El código no es válido. Verifícalo o solicita uno nuevo.',
  EXPIRED_OTP_CODE: 'El código ha vencido. Solicita uno nuevo.',
  USER_IS_NOT_ACTIVE: 'Tu cuenta está inactiva. Contacta con administración.',
  INVALID_REQUEST: 'Los datos enviados no son válidos. Revisa el formulario.',
  UNAUTHORIZED: 'Inicia sesión para continuar.',
  INVALID_TOKEN: 'Tu sesión ha vencido o no es válida. Inicia sesión nuevamente.',
  AccessDeniedException: 'No tienes permiso para realizar esta operación.',
  MethodArgumentTypeMismatchException: 'El identificador enviado no es válido.',
  MethodArgumentNotValidException: 'Revisa los campos obligatorios y sus formatos.',
  IllegalStateException: 'No pudimos completar la solicitud. Inténtalo más tarde.',
} as const satisfies Readonly<Record<string, string>>;

export type IdentityErrorCode = keyof typeof IDENTITY_ERROR_MESSAGES;

export function isIdentityErrorCode(code: string): code is IdentityErrorCode {
  return Object.hasOwn(IDENTITY_ERROR_MESSAGES, code);
}

export const HTTP_ERROR_MESSAGES: Readonly<Partial<Record<number, string>>> = {
  0: 'No pudimos conectar con el servidor. Inténtalo nuevamente.',
  400: IDENTITY_ERROR_MESSAGES.INVALID_REQUEST,
  401: IDENTITY_ERROR_MESSAGES.INVALID_TOKEN,
  403: IDENTITY_ERROR_MESSAGES.AccessDeniedException,
  404: 'No se encontró el recurso solicitado.',
  409: 'La operación entra en conflicto con los datos actuales. Revisa la información.',
  422: IDENTITY_ERROR_MESSAGES.INVALID_REQUEST,
  429: 'Has realizado demasiadas solicitudes. Espera un momento.',
};

export const CONTEXT_ERROR_MESSAGES = {
  accountAccess: 'No pudimos habilitar el acceso a tu cuenta. Contacta con administración.',
  codeDelivery: 'No pudimos enviar el código a tu correo. Inténtalo más tarde.',
  unconfirmedMutation: 'No se pudo confirmar la operación. Actualiza la lista antes de reintentar.',
  invalidOtp: 'El código no es válido o ha vencido.',
  unavailable: 'El servicio no está disponible en este momento.',
  default: 'No pudimos completar la solicitud. Inténtalo nuevamente.',
} as const;
