import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { db } from "@/modules/db";
import { zodValidator } from "@/modules/shared/lib/zod";
import { apiRouteHandler } from "@/modules/shared/utils/handler";
import { workspaceValidator } from "@/modules/feed/lib/zod";
import z from "zod";

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

   await db.workspace.create({ by: { userId: user.id }, data: { name: body.name } });


    return {
      message: "Workspace created successfully",
    }

  });
}

//Get all workspaces
export async function GET() {

  return apiRouteHandler( async () => {

    const user = await getAuthenticatedUser(); 

    const list = await db.workspace.list(user.id);

    return {
      list
    };

  });

}