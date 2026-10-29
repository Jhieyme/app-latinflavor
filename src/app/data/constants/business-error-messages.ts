export const BUSINESS_ERROR_MESSAGES: Readonly<Record<string, string>> = {
  OPERATING_HOURS_NOT_FOUND: 'No encontramos el horario. Actualiza la lista.',
  OPERATING_HOURS_DAY_ALREADY_EXISTS: 'Ya existe un horario para ese día. Puedes editarlo desde el listado.',
  INVALID_OPERATING_HOURS: 'La apertura debe ser anterior al cierre y el intervalo debe ser mayor que cero.',
  UNSUPPORTED_OPERATING_HOURS_SEARCH_FILTER: 'El filtro de horarios no está disponible.',
  ZONE_IS_NOT_ACTIVE: 'La zona está inactiva. Habilítala antes de asignarle una mesa.',
  ZONE_NOT_FOUND: 'No encontramos la zona. Actualiza la lista e inténtalo nuevamente.',
  ZONE_ALREADY_EXISTS: 'Ya existe una zona con ese código.',
  DINING_TABLE_NOT_FOUND: 'No encontramos la mesa. Actualiza la lista e inténtalo nuevamente.',
  UNSUPPORTED_ZONE_SEARCH_FILTER: 'El filtro de zonas no está disponible.',
  UNSUPPORTED_DINING_TABLE_SEARCH_FILTER: 'El filtro de mesas no está disponible.',
  UNSUPPORTED_SORT_FIELD: 'El orden seleccionado no está disponible.',
};
export const BUSINESS_HTTP_ERRORS: Readonly<Partial<Record<number, string>>> = {
  0: 'No pudimos conectar con el servicio de administración del restaurante.',
  400: 'Revisa los datos ingresados e inténtalo nuevamente.',
  401: 'Tu sesión venció. Vuelve a iniciar sesión.',
  403: 'No tienes permiso para realizar esta operación.',
  404: 'El registro ya no está disponible. Actualiza la lista.',
  409: 'Ya existe un registro con esos datos o la operación genera un conflicto.',
  429: 'Espera un momento antes de volver a intentarlo.',
};
export const BUSINESS_ERROR_FALLBACK = 'No pudimos completar la operación. Inténtalo nuevamente.';
