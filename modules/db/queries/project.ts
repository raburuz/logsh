import { and, asc, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { DbTransaction } from "../interface";
import { project, projectMember } from "../schemas/app";
import { ApiHttpError } from "@/modules/shared/lib/error";

export const ProjectMemberRoles= {
  OWNER: 'owner',
}

export const projectStatus = {
  ACTIVE: 'active',
  DELETED: 'deleted',
}

export const projectQuery = {
  get: async ( 
    query : { 
      identifyBy?: { type: "projectId" | "name", value: string }, 
      where: { 
        userId: string,
        pick?: "oldest"| "newest" | "any" 
      }
    },
    options?: {
      tx?: DbTransaction,
    } 
  ) => {

    const { identifyBy, where } = query;
    const { tx } = options ?? {};
    const dbToUse = tx ?? db;

    const wheres = [];

    if( identifyBy ) {
      const projectField = identifyBy.type === "projectId" 
        ? project.id 
        : project.name;
      wheres.push( eq(projectField, identifyBy.value.toLowerCase()) );
    }


    const queryDb = dbToUse
      .select({
        id: project.id,
        name: project.name,
      })
      .from(projectMember)
      .innerJoin(project, eq(project.id, projectMember.projectId))
      .where(
        and(
          ...wheres,
          eq(projectMember.userId, where.userId),
          eq(project.id, projectMember.projectId),
          eq(project.status, projectStatus.ACTIVE)
        )
      );

    if(where.pick === "oldest") {
      queryDb.orderBy( asc(project.createdAt) );
    }

    queryDb.limit(1);

    const response = await queryDb;

    return response.length === 0 ? null : response[0];
  },

  create: async (
    query: {
      by: { userId: string },
      data: { name: string },
    },
    options?: {
      tx?: DbTransaction
    }
  ) => {
    const { by, data } = query;
    const { tx } = options ?? {};
    const dbToUse = tx ?? db;

     const resp = await dbToUse.transaction( async (tx) => {

      const [ pj ] = await tx
      .insert(project)
      .values({
        name: data.name.toLowerCase(),
      })
      .returning({
        id: project.id,
        name: project.name,
      });

      await tx
      .insert(projectMember)
      .values({
        projectId: pj.id,
        userId: by.userId,
        role: ProjectMemberRoles.OWNER,
      });

      return {
        id: pj.id,
        name: pj.name
      }

    })

    return resp;

  },

  find_or_create: async (
    query: {
      by: { userId: string },
      data: { name: string },
    },
    options?: {
      tx?: DbTransaction
    }
  ) => {

    const { by, data } = query;
    const { tx } = options ?? {};
  
    let response = await projectQuery.get({ identifyBy: { type: "name", value: data.name }, where: by }, { tx });
  
    if(!response){
      response = await projectQuery.create({ by, data }, { tx });
    }
  
    return {
      id: response.id,
      name: data.name,
    }
  },

  delete: async (
    query: {
      by: {
        userId: string,
      },
      where: {
        projectId: string 
      }
    } 
  ) => {

    const isOwner = await projectQuery.is_owner( query.by.userId, query.where.projectId )

    if(!isOwner) throw new ApiHttpError({ name: 'unauthorized', message: 'This project can only be deleted by its owner' });

    await db
    .update(project)
    .set({
      status: projectStatus.DELETED,
    })
    .where(
      eq(project.id, query.where.projectId)
    )
  },

  is_owner: async ( 
    userId: string, 
    projectId: string 
  ) => {
    const result = await db
    .select({
      id: projectMember.id,
    })
    .from(projectMember)
    .where(
      and(
        eq(projectMember.projectId, projectId),
        eq(projectMember.userId, userId),
        eq(projectMember.role, ProjectMemberRoles.OWNER),
      )
    )
    .limit(1);
  
    return result.length > 0;
  },

  list: async ( userId: string ) => {
    return await db
    .select({
      id: project.id,
      name: project.name,
    })
    .from(projectMember)
    .innerJoin(project, 
      and(
        eq(projectMember.projectId, project.id),
        eq(project.status, projectStatus.ACTIVE)
      )
    )
    .where(
      and(
        eq(projectMember.userId, userId),
      )
    )
    .orderBy( desc(project.createdAt) );
  },
} 