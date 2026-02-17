import { db } from "@/modules/db";
import { dayjs } from "@/modules/shared/lib/date";
import { apiRouteHandler } from "@/modules/shared/utils/handler";

export async function GET(request: Request) {

  return apiRouteHandler( async () => {
    
      // Verify the cron secret
      const authHeader = request.headers.get('authorization');
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
          status: 401,
        });
      }

      // Delete all events older than 1 year
      await db.event.delete_all({ where: { gte: { milliseconds: dayjs().subtract(1, 'year').millisecond() } } });


    return {}
  } )
}