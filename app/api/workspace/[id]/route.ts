import z from "zod";
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { db } from "@/modules/db";
import { zodValidator } from "@/modules/shared/lib/zod";
import { apiRouteHandler } from "@/modules/shared/utils/handler";

export async function DELETE( request: Request, ctx: RouteContext<'/api/workspace/[id]'> ) {
  return apiRouteHandler( async () => {
    
    const { id }  = await ctx.params;

    const { params } = await zodValidator({
      params: {
        workspaceId: id
      }
    }, { params: z.object({ workspaceId: z.string() }) } );


    const user = await getAuthenticatedUser();

    await db.workspace.delete({  by: { projectName: 'defaults', userId: user.id }, where: { workspaceId: params.workspaceId } });  
    
    return {};
  } );
}