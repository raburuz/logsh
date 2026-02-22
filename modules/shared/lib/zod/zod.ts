/* LIBRARIES */
import { z, ZodType } from "zod";
/* App */
import { ApiHttpError } from "../error";

export type InferSchemaValues<T extends ZodType<any>> = z.infer<T>;

export const zodValidator = async <
  Body extends ZodType<any> ,
  Params extends ZodType<any> ,
  Query extends ZodType<any> ,
>(
  request: {
    body?: unknown,
    params?: unknown,
    query?: unknown,
  },
  data:{
    body?: Body,
    params?: Params,
    query?: Query,
  }
) => {

  const schema = z.object(data);

  const result = await schema.safeParseAsync({
    body: request.body,
    params: request.params,
    query: request.query,
  });

  if (!result.success || result.error) {

    const errors = result.error?.issues.map(issue => ({
      code: issue.code.toUpperCase(),
      message: issue.message,
      path: issue.path.join('.'),
    }));

    throw new ApiHttpError({ 
      name: 'validation_error',
      message: `${result.error?.issues[0].message}.`
    });
    
  }

  return result.data as unknown as {
    body: InferSchemaValues<Body>;
    params: InferSchemaValues<Params>;
    query: InferSchemaValues<Query>;
  };
};