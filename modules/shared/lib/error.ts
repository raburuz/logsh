
export const APP_ERROR_CODES_BY_KEY = {
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

export type APP_ERROR_CODE_KEY = keyof typeof APP_ERROR_CODES_BY_KEY;

export class AppError extends Error {
  
  public readonly statusCode: number;
  public readonly name: APP_ERROR_CODE_KEY;
  
  constructor( 
    name: APP_ERROR_CODE_KEY, 
    message: string, 
  ){
    super();
     
    this.name = name;
    this.message = message;
    this.statusCode = APP_ERROR_CODES_BY_KEY[this.name];
  
    Object.setPrototypeOf(this, AppError.prototype);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public override toString(){
    return JSON.stringify(
      {
        message: this.message,
        name: this.name,
      },
      null,
      2,
    );
  }
}

export class RateLimitError extends AppError {

  header: Record<string, string>;

  constructor( 
    message = 'Rate limit exceeded. Try again later.', 
    headers: Record<string, string> = {}
  ) {
    super('rate_limit_exceeded', message);
    this.header = headers;
  }

} 