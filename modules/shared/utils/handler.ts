import { NextResponse } from "next/server"
import { APIError } from "better-auth";
import { AppError, RateLimitError } from "../lib/error"

export async function apiRouteHandler ( 
  fn: ()=>Promise<any>,
  options?: {
    statusCode?: number,
  }
) {

  try {

    const data = await fn();
    const statusCode = options?.statusCode ?? 200;

    return NextResponse.json(
      { data },
      { status: statusCode }
    )

  } catch (error: unknown ) {
    logError(error, { env: process.env.NODE_ENV });

    const errorResponse = normalizeError(error);

    return NextResponse.json({
      status: errorResponse.status,
      name: errorResponse.name, 
      message: errorResponse.message,
    }, { status: errorResponse.status, headers: errorResponse.headers });
  }
}

export function logError(error: unknown, context: { env?: string; }): void {
  const normalizedError = normalizeError(error);
  const isDevelopment = context.env === 'development';

  // Metadata
  const metadata = {
    timestamp: new Date().toISOString(),
    environment: context.env || process.env.NODE_ENV,
    ...context,
  };

  // Development: detailed console logging with colors and formatting
  if (isDevelopment) {
    console.log('\n' + '='.repeat(60));
    console.log('🚨 ERROR DETECTED');
    console.log('='.repeat(60));
    console.log('\n📋 Error Details:');
    console.log(`  Name: ${normalizedError.name}`);
    console.log(`  Message: ${normalizedError.message}`);
    console.log(`  Status: ${normalizedError.status}`);
    
    console.log('\n🔍 Context:');
    console.log(JSON.stringify(metadata, null, 2));
    
    if (error instanceof Error && error.stack) {
      console.log('\n📚 Stack Trace:');
      console.log(error.stack);
    }
    
    console.log('\n' + '='.repeat(60));
    console.log('🟢 SERVER STILL RUNNING...');
    console.log('='.repeat(60) + '\n');
    
    return;
  }

  // In production: structured logging (JSON for monitoring tools)
  const logEntry = {
    level: 'error',
    error: {
      name: normalizedError.name,
      message: normalizedError.message,
      status: normalizedError.status,
      stack: error instanceof Error ? error.stack : undefined,
    },
    context: metadata,
  };

  // Structured JSON for parsers (Datadog, CloudWatch, etc.)
  console.error(JSON.stringify(logEntry));

  // Here you would integrate external services:
  // sendToSentry(error, metadata);
  // sendToDatadog(logEntry);
  // sendToCloudWatch(logEntry);
}

export function normalizeError(error: unknown): { status: number; name: string; message: string; headers?: Record<string, string> } {
  // Custom application error

  if(error instanceof RateLimitError) {
    return {
      status: error.statusCode,
      name: error.name,
      message: error.message,
      headers: error.header,
    };
  }

  if (error instanceof AppError) {
    return {
      status: error.statusCode,
      name: error.name,
      message: error.message,
    };
  }

  if (error instanceof APIError) {
    return {
      status: error.statusCode,
      name: error.name,
      message: error.message,
    };
  }

  // Native JavaScript error
  if (error instanceof Error) {
    return {
      status: 500,
      name: error.name,
      message: error.message,
    };
  }

  // Object with error properties
  if (typeof error === 'object' && error !== null) {
    const err = error as any;
    return {
      status: err.statusCode || err.status || 500,
      name: err.name || 'UnknownError',
      message: err.message || 'An unknown error occurred',
    };
  }

  // Last resort: completely unknown error
  return {
    status: 500,
    name: 'UnknownError',
    message: String(error),
  };
}