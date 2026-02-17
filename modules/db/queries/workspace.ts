import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { workspace, workspaceMember } from "../schemas/app";
import { AppError } from "@/modules/shared/lib/error";
import { DbTransaction } from "../interface";

export const workspaceStatus = {
  ACTIVE: 'active',
  DELETED: 'deleted',
}

export const workspaceMemberRoles= {
  OWNER: 'owner',
}

export const workspaceQuery = {
  create: async ( 
    query: {
      by: { userId: string },
      data: { name: string }
    },
    options?: {
      tx?: DbTransaction
    }
   ) => {

    const { by, data } = query;
    const { tx } = options ?? {};
    const dbToUse = tx ?? db;

    const alreadyExists = await workspaceQuery.exist(by.userId, data.name);

    if(alreadyExists) throw new AppError('bad_request', 'Workspace with this name already exists');
  
    const [ wks ] = await dbToUse
    .insert(workspace)
    .values({
      name: data.name.toLowerCase(),
      status: workspaceStatus.ACTIVE,
    }).returning({ id: workspace.id });

    await dbToUse
    .insert(workspaceMember)
    .values({
      userId: by.userId,
      workspaceId: wks.id,
      role: workspaceMemberRoles.OWNER,
    });
  
    return { id: wks.id }
  
  },

  delete: async (
    query: {
      by: {
        userId: string,
      },
      where: {
        workspaceId: string 
      }
    } 
  ) => {

    const isOwner = await workspaceQuery.is_owner( query.by.userId, query.where.workspaceId )

    if(!isOwner) throw new AppError('unauthorized', 'This workspace can only be deleted by its owner');

    await db
    .update(workspace)
    .set({
      status: workspaceStatus.DELETED,
    })
    .where(
      eq(workspace.id, query.where.workspaceId)
    )
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

  list : async ( userId: string ) => {

    return await db
    .select({
      id: workspace.id,
      name: workspace.name,
    })
    .from(workspaceMember)
    .innerJoin(workspace, 
      and(
        eq(workspaceMember.workspaceId, workspace.id),
        eq(workspace.status, workspaceStatus.ACTIVE)
      )
    )
    .where(
      and(
        eq(workspaceMember.userId, userId),
      )
    )
    .orderBy( desc(workspace.createdAt) );
  },

  find_or_create: async (
    query: {
      by: { userId: string },
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
    .from(workspaceMember)
    .innerJoin(workspace, eq(workspace.id, workspaceMember.workspaceId))
    .where(
      and(
        eq(workspaceMember.userId, by.userId),
        eq(workspace.id, workspaceMember.workspaceId),
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

  exist: async ( userId: string, name: string ) => {
  
    const [ response ] = await db
    .select({
      id: workspaceMember.id
    })
    .from(workspaceMember)
    .leftJoin(workspace, eq(workspace.id, workspaceMember.workspaceId))
    .where(
      and(
        eq(workspaceMember.userId, userId),
        eq(workspaceMember.role, workspaceMemberRoles.OWNER),
        //Workspace condition
        eq(workspace.name, name),
        eq(workspace.status, workspaceStatus.ACTIVE),
      )
    )
    .limit(1)
  
    return Boolean(response)
  },

  is_owner: async ( 
    userId: string, 
    workspaceId: string 
  ) => {
    const result = await db
    .select({
      id: workspaceMember.id,
    })
    .from(workspaceMember)
    .where(
      and(
        eq(workspaceMember.workspaceId, workspaceId),
        eq(workspaceMember.userId, userId),
        eq(workspaceMember.role, workspaceMemberRoles.OWNER),
      )
    )
    .limit(1);
  
    return result.length > 0;
  },
}
