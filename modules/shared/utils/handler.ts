import { NextResponse } from "next/server"
import { APIError } from "better-auth";
import { AppError } from "../lib/error"

export async function routeHandler<T>(fn: () => Promise<T>) {
  try {
    
    const data = await fn();
    return NextResponse.json(
      { status: 200, data, },
      { status: 200 }
    )

  } catch (error: any) {

    if(process.env.NODE_ENV === 'development'){
      console.log('\n');
      console.log('🚧 Error → ' + JSON.stringify(error, null, 2));
      //console.log('🌎 Stack → ' + error?.stack);
      console.log('🟢 Status → SERVER IS STILL RUNNING... ')
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        { status: error.statusCode, name: error.name, message: error.message, },
        { status: error.statusCode }
      )
    }

    if(error instanceof APIError){
      return NextResponse.json(
        { status: error.statusCode, name: error.name, message: error.message, },
        { status: error.statusCode }
      )
    }

    return NextResponse.json(
      { status: 500, name: "InternalServerError", message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
