import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { db } from "@/modules/db";
import { zodValidator } from "@/modules/shared/lib/zod";
import { routeHandler } from "@/modules/shared/utils/handler";
import { workspaceValidator } from "@/modules/workspace/lib/zod";
import z from "zod";

//Create a new workspace
export async function POST( request: Request ) {

  return routeHandler( async () => {

    const bodyRequest = await request.json();

    const user = await getAuthenticatedUser();

    const { body } = await zodValidator({ body: bodyRequest }, {
      body: z.strictObject({
        name: workspaceValidator.name, 
      })
    });

   await db.workspace.create(user.id, { name: body.name });


    return {
      message: "Workspace created successfully",
    }

  });
}

//Get all workspaces
export async function GET() {

  return routeHandler( async () => {

    const user = await getAuthenticatedUser(); 

    const list = await db.workspace.list(user.id);

    return list;

  });

}