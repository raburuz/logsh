import { getAuthenticatedUser } from "@/modules/auth/actions/auth";
import { db } from "@/modules/db";
import { apiRouteHandler } from "@/modules/shared/utils/handler";

export async function GET(request: Request) {

  return apiRouteHandler( async () => {

    const user = await getAuthenticatedUser();

    const project = await db
    .project
    .get({
      where: {
        userId: user.id,
        pick: "oldest",
      }
    })

    if(!project) throw new Error("Project not found");

    const workspaces = await db
    .workspace
    .list({
      by: {
        projectId: project.id,
      }
    });

    return {
      id: project.id,
      name: project.name,
      workspaces: {
        list: workspaces,
      },
    }

  })
}