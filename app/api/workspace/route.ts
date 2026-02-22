import z from "zod";
import { db } from "@/modules/db";
import { zodValidator } from "@/modules/shared/lib/zod/zod";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user";
import { workspaceValidator } from "@/modules/feed/lib/zod";

//Create a new workspace
export const POST = withUser( async ({ user, request }) => {

  const bodyRequest = await request.json();

  const { body } = await zodValidator({ body: bodyRequest }, {
    body: z.strictObject({
      name: workspaceValidator.name, 
    })
  });
  
  const project = await db.project.find_or_create({ by: { userId: user.id }, data: { name: 'default' } });
  
  const workspace = await db.workspace.create({ by: { projectId: project.id }, data: { name: body.name } });
  
  return {
    id: workspace.id,
    name: workspace.name,
  }

})