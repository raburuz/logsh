import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { project, workspace } from "../schemas/app";
import { AppError } from "@/modules/shared/lib/error";
import { DbTransaction } from "../interface";
import { projectQuery } from "./project";

export const workspaceStatus = {
  ACTIVE: 'active',
  DELETED: 'deleted',
}

export const workspaceQuery = {
  create: async ( 
    query: {
      by: { projectId: string },
      data: { name: string }
    },
    options?: {
      tx?: DbTransaction
    }
   ) => {

    const { by, data } = query;
    const { tx } = options ?? {};
    const dbToUse = tx ?? db;

    const alreadyExists = await workspaceQuery.exist(by.projectId, data.name);

    if(alreadyExists) throw new AppError('bad_request', 'Workspace with this name already exists');
  
    const [ wks ] = await dbToUse
    .insert(workspace)
    .values({
      name: data.name.toLowerCase(),
      status: workspaceStatus.ACTIVE,
      projectId: by.projectId,
    })
    .returning({ id: workspace.id, name: workspace.name });

    
    return { id: wks.id, name: wks.name }
  
  },

  delete: async (
    query: {
      by: {
        userId: string,
        projectName: string
      }
      where: {
        workspaceId: string 
      }
    } 
  ) => {

    await db.transaction( async (tx) => {

      const project = await projectQuery.get(
        { 
          identifyBy: { type: 'name', value: query.by.projectName }, 
          where: { userId: query.by.userId } 
        }, { tx });

      if(!project) throw new AppError('not_found', 'Project linked to this workspace not found');

      await tx
      .update(workspace)
      .set({
        status: workspaceStatus.DELETED,
      })
      .where(
        and(
          eq(workspace.projectId, project.id),
          eq(workspace.id, query.where.workspaceId),
        )
      );
        
    })

  },
  
  get: async (
    query: {
      by: { workspaceId: string}
    },
    options?: {
      tx?: DbTransaction
    }
  ) => {
    const { tx } = options ?? {};
    const dbToUse = tx ?? db;
    const result = await dbToUse
    .select({
      id: workspace.id,
      name: workspace.name,
    })
    .from(workspace)
    .where(
      and(
        eq( workspace.id, query.by.workspaceId ),
        eq( workspace.status, workspaceStatus.ACTIVE)
      )
    )
    .limit(1)
  
    return result.length === 0 ? null : result[0];
  },

  list : async ( query: { by: { projectId: string } }) => {

    return await db
    .select({
      id: workspace.id,
      name: workspace.name,
    })
    .from(workspace)
    .innerJoin( project, 
      and(
        eq(workspace.projectId, query.by.projectId),
        eq(workspace.status, workspaceStatus.ACTIVE)
      )
    )
    .orderBy( desc(workspace.createdAt) );
  },

  find_or_create: async (
    query: {
      by: { projectId: string },
      data: { name: string }
    },
    options?: {
      tx?: DbTransaction
    }
  ) => {
    const { by, data } = query;
    const { tx } = options ?? {};
    const dbToUse = tx ?? db;
  
    let [ response ] = await dbToUse
    .select({
      id: workspace.id
    })
    .from(workspace)
    .where(
      and(
        eq(workspace.projectId, by.projectId),
        eq(workspace.name, data.name),
        eq(workspace.status, workspaceStatus.ACTIVE)
      )
    )
    .limit(1);
  
    if(!response){
      response = await workspaceQuery.create({ by, data }, { tx });
    }
  
    return {
      id: response.id,
      name: data.name,
    }
  },

  exist: async ( projectId: string, name: string ) => {
  
    const [ response ] = await db
    .select({
      id: workspace.id
    })
    .from(workspace)
    .where(
      and(
        eq(workspace.projectId, projectId),
        eq(workspace.name, name),
        eq(workspace.status, workspaceStatus.ACTIVE),
      )
    )
    .limit(1);
  
    return Boolean(response)
  },

}
