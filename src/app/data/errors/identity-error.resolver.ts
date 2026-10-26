import {
  CONTEXT_ERROR_MESSAGES,
  HTTP_ERROR_MESSAGES,
  IDENTITY_ERROR_MESSAGES,
  isIdentityErrorCode,
} from '../constants/error-messages';

export interface IdentityErrorContext {
  readonly status: number;
  readonly code: string | null;
  readonly method: string;
  readonly path: string;
  readonly isOtp: boolean;
}

type MessageRule = (context: IdentityErrorContext) => string | undefined;

const resolveSignInConfiguration: MessageRule = ({ path, code }) => {
  if (path.endsWith('/sign-in') && (code === 'ROLE_NOT_FOUND' || code === 'PERMISSION_NOT_FOUND')) {
    return CONTEXT_ERROR_MESSAGES.accountAccess;
  }
  return undefined;
};

const resolveCodeDelivery: MessageRule = ({ path, status }) => {
  if (path.endsWith('/generate-code') && status >= 500) return CONTEXT_ERROR_MESSAGES.codeDelivery;
  return undefined;
};

const resolveBusinessCode: MessageRule = ({ code }) =>
  code && isIdentityErrorCode(code) ? IDENTITY_ERROR_MESSAGES[code] : undefined;

const resolveUnconfirmedMutation: MessageRule = ({ method, path, status }) => {
  const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  if (isMutation && /\/users(?:\/|$)/.test(path) && (status === 0 || status >= 500)) {
    return CONTEXT_ERROR_MESSAGES.unconfirmedMutation;
  }
  return undefined;
};

const resolveSignInUnauthorized: MessageRule = ({ status, path, isOtp }) => {
  if (status === 401 && path.endsWith('/sign-in')) {
    return isOtp ? CONTEXT_ERROR_MESSAGES.invalidOtp : IDENTITY_ERROR_MESSAGES.INVALID_CREDENTIALS;
  }
  return undefined;
};

const resolveHttpStatus: MessageRule = ({ status }) =>
  HTTP_ERROR_MESSAGES[status] ?? (status >= 500 ? CONTEXT_ERROR_MESSAGES.unavailable : undefined);

const MESSAGE_RULES: readonly MessageRule[] = [
  resolveSignInConfiguration,
  resolveCodeDelivery,
  resolveBusinessCode,
  resolveUnconfirmedMutation,
  resolveSignInUnauthorized,
  resolveHttpStatus,
];

export function resolveIdentityErrorMessage(context: IdentityErrorContext): string {
  for (const rule of MESSAGE_RULES) {
    const message = rule(context);
    if (message !== undefined) return message;
  }
  return CONTEXT_ERROR_MESSAGES.default;
}
