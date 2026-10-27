export function readExceptionCode(payload: unknown): string | null {
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

