export class ApplicationError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: string | null,
    readonly originalError: unknown,
  ) {
    super(message);
    this.name = 'ApplicationError';
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof ApplicationError
    ? error.message
    : 'Ocurrió un error inesperado. Inténtalo nuevamente.';
}
