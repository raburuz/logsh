export const HTTP_ERROR_CODES_BY_KEY = {
  unauthorized: 401,
  payment_required: 402,
  forbidden: 403,
  not_found: 404,
  internal_server_error: 500,
  application_error: 500,
  conflict: 409,
  bad_request: 400,
  invalid_access: 422,
  invalid_parameter: 422,
  invalid_region: 422,
  rate_limit_exceeded: 429,
  validation_error: 403,
  method_not_allowed: 405,
} as const;

export type HTTP_ERROR_CODE_KEY = keyof typeof HTTP_ERROR_CODES_BY_KEY;