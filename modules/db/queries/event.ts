import { db } from "../db";
import { event, workspace } from "../schemas/app";
import { subscriptionQuery } from "./subscription";
import { and, desc, eq, gte, lt, or } from "drizzle-orm";
import { workspaceQuery, workspaceStatus } from "./workspace";
import { dayjs } from "@/modules/shared/lib/date";
import { projectQuery } from "./project";

export const eventQuery = {
  create: async (
    props: {
      query : {
        where: {
          project: string,
          workspace: string,
          userId: string,
        },
        data: {
          event: string,
          description: string
          icon: string,
          metadata?: Record<string, any>,
        }
      },
      options: {
        consumeEventUsage: false | { 
          where: { subscriptionId: string }
          query: { quantity: number }
        },
      }
    },
  ) => {
    const { data, where } = props.query;
    const { options } = props;

    const res = await db.transaction( async (tx) => {

      // Project existence and creation if not exists
      const prj = await projectQuery
        .find_or_create({
          by: { userId: where.userId },
          data: { name: where.project },
        }, { tx });

      // Workspace existence and creation if not exists
      const wk = await workspaceQuery
        .find_or_create({ 
          by: { projectId: prj.id }, 
          data: { name: where.workspace },  
        }, { tx });
      
      // Event creation
      const [ response ] = await tx
      .insert(event)
      .values({
        workspaceId: wk.id,
        event: data.event,
        description: data.description,
        icon: data.icon,
        metadata: data.metadata,
      })
      .returning({
        id: event.id,
        createdAt: event.createdAt,
      })

      //Limit consumption if specified in options
      if(options.consumeEventUsage) {
        await subscriptionQuery.update_usage({
          by: { subscriptionId: options.consumeEventUsage.where.subscriptionId },
          data: {
            event: {
              quantity: options.consumeEventUsage.query.quantity,
              action: 'add',
            }
          }
        }, { tx });
      }

      return {
        id: response.id,
        createdAt: response.createdAt,
        workspaceId: wk.id,
        projectId: prj.id,
      };
    
    });

    return res;
  
  },
  list: async (
      data: {
      entity: {
        //extendable for other entities in the future
        table: 'workspace',
        id: string,  
      },
      nextCursor?: {
        id: string,
        createdAt: Date,
      },
      query : {
        take: number,
      },
      userId: string,
    }
  )=> {
  
    const { nextCursor, entity, query } = data;
    const whereConditions:any[] = [
      eq(workspace.status, workspaceStatus.ACTIVE),
    ];
  
    switch (entity.table) {
      case "workspace":
        whereConditions.push( eq(event.workspaceId, entity.id) );
        break;
      // Extendable for other entities in the future
      ;
    }
  
    if(nextCursor) {
      whereConditions.push(
        or(
          lt(event.createdAt, nextCursor.createdAt),
          and(
            eq(event.createdAt, nextCursor.createdAt),
            lt(event.id, nextCursor.id)
          )
        )
      );
    }
  
    const response = await db
    .select({
      id: event.id,
      event: event.event,
      description: event.description,
      createdAt: event.createdAt,
      icon: event.icon,
      workspace: workspace.name,
      workspaceId: event.workspaceId,
      metadata: event.metadata,
    })
    .from(event)
    .innerJoin(workspace, eq(event.workspaceId, workspace.id))
    .where(and(...whereConditions))
    .orderBy( desc( event.createdAt), desc(event.id))
    .limit(query.take)
  
    return response;

  },
  delete_all: async ( queryData: { where: { gte: { milliseconds: number } } }) => {

    const { where } = queryData;

    const date = dayjs().subtract(where.gte.milliseconds, 'milliseconds').toDate();

    await db
    .delete(event)
    .where(
      and(
        gte(event.createdAt, date)
      )
    )
  }
}