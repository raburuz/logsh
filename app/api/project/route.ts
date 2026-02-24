import { db } from "@/modules/db";
import { withUser } from "@/modules/shared/lib/auth/middlewares/user";
import { ApiHttpError } from "@/modules/shared/lib/error";

export const GET = withUser( async ({ user }) => {

  const project = await db
  .project
  .get({
    where: {
      userId: user.id,
      pick: "oldest",
    }
  })
  
  if(!project) throw new ApiHttpError({
    name: 'not_found',
    message: 'Project not found',
  });
  
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
