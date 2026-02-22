import { HTTP_ERROR_CODE_KEY, HTTP_ERROR_CODES_BY_KEY } from "../contraint";

export class ApiHttpError extends Error {

  public readonly httpStatusCode: number;
  public readonly name: HTTP_ERROR_CODE_KEY;
  public readonly httpHeaders?: Record<string, string>;
  public readonly details?: string;

  constructor( 
    data: {
      name: HTTP_ERROR_CODE_KEY, 
      message: string, 
      httpHeaders?: Record<string, string>,
      details?: string
    }
  ){
    super();
     
    this.name = data.name;
    this.message = data.message;
    this.details = data.details;
    this.httpStatusCode = HTTP_ERROR_CODES_BY_KEY[this.name];
    this.httpHeaders = data.httpHeaders;
  
    Object.setPrototypeOf(this, ApiHttpError.prototype);
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
