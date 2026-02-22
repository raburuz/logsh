import { withUser } from "@/modules/shared/lib/auth/middlewares/user";
import { ApiHttpError } from "@/modules/shared/lib/error";
import { getChannelName } from "@/modules/shared/lib/pub-sub";
import { isRedisReady, redis } from "@/modules/shared/lib/redis";

// This is required to enable streaming
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const GET = withUser( async ({ request, user }) => {

  if(!isRedisReady()) {
    throw new ApiHttpError({
      name: "internal_server_error",
      message: "Event streaming service is currently unavailable. Please try again later.",
      details: "Wait until the streaming service is ready before establishing SSE connection."
    });
  }
  
  // Initialize Upstash Redis client
  const subscriber = redis.duplicate();
  
  // Create a TransformStream to handle streaming data
  const responseStream = new TransformStream();
  const writer = responseStream.writable.getWriter();
  const encoder = new TextEncoder();
  
  await subscriber.subscribe(getChannelName(user.id));
  
  
  // Send an initial comment to establish the SSE connection
  writer.write(encoder.encode('event: keep-alive\ndata: keep alive\n\n'));
  
  subscriber.on('message', async (_channel, message) => {
    // Send the message to the client
    const sseMessage =  "event: event\n"+`data: ${message}\n\n`;
    writer.write(encoder.encode(sseMessage));
  });
  
  // Keep the connection alive by sending a comment every 15 seconds
  const interval = setInterval(async () => {
    writer.write(encoder.encode('event: keep-alive\ndata: keep alive\n\n'));
  }, 15000); 
  
  // Handle client disconnect
  request.signal.addEventListener('abort', () => {
  
    //Must close all the conections
    subscriber.quit();
    clearInterval(interval);
    writer.close();
    console.log('SSE connection closed by client');
  });

  // Headers for SSE with the response, including necessary cache control
  return responseStream.readable;

}, {
  enableStreaming: true,
})
