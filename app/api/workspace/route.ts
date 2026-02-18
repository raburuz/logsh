import z from "zod";
import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { db } from "@/modules/db";
import { zodValidator } from "@/modules/shared/lib/zod";
import { apiRouteHandler } from "@/modules/shared/utils/handler";
import { workspaceValidator } from "@/modules/feed/lib/zod";

//Create a new workspace
export async function POST( request: Request ) {

  return apiRouteHandler( async () => {

    const bodyRequest = await request.json();

    const user = await getAuthenticatedUser();

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

  });
}