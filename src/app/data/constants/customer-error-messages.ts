export const CUSTOMER_ERROR_MESSAGES = {
  CUSTOMER_IS_NOT_ACTIVE: 'Tu perfil de cliente está inactivo. Contacta con administración.',
  CUSTOMER_NOT_FOUND: 'No encontramos tu perfil de cliente. Intenta consultar nuevamente.',
  CUSTOMER_ALREADY_EXISTS: 'Ya existe un perfil de cliente para esta cuenta.',
} as const;

export const CUSTOMER_HTTP_ERROR_MESSAGES: Readonly<Partial<Record<number, string>>> = {
  0: 'No pudimos conectar con el servicio de clientes. Inténtalo nuevamente.',
  400: 'Revisa los datos de tu perfil.',
  401: 'Tu sesión no es válida. Vuelve a iniciar sesión.',
  403: 'No tienes permiso para acceder a este perfil.',
  404: CUSTOMER_ERROR_MESSAGES.CUSTOMER_NOT_FOUND,
  409: 'Los datos del perfil entran en conflicto con un registro existente.',
  429: 'Has realizado demasiadas solicitudes. Espera un momento.',
};

export const CUSTOMER_ERROR_FALLBACK = 'No pudimos completar la solicitud del perfil. Inténtalo nuevamente.';
