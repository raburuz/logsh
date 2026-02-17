import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { getChannelName, redisInstance } from "@/modules/shared/lib/redis";

export const runtime = 'nodejs';
// This is required to enable streaming
export const dynamic = 'force-dynamic';

export async function GET( request : Request ) {

  //Authentication check
  const user = await getAuthenticatedUser();
  if (!user) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Initialize Upstash Redis client
  const subscriber = redisInstance();
  
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
  return new Response(responseStream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })



}