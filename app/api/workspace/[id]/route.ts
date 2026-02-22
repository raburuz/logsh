import z from "zod";
import { db } from "@/modules/db";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user";

//ctx: RouteContext<'/api/workspace/[id]'>

export const DELETE = withUser( async ({ user, ctx }) => {

  const context: RouteContext<'/api/workspace/[id]'> = ctx;
  const { id }  = await context.params;
  
  const { params } = await zodValidator({
    params: {
      workspaceId: id
    }
  }, { params: z.object({ workspaceId: z.string() }) } );
  await db.workspace.delete({  by: { projectName: 'default', userId: user.id }, where: { workspaceId: params.workspaceId } });  
  
  return {};

})
