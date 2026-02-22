import { relations } from "drizzle-orm";
import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { subscription, user } from "./auth";

export const project = pgTable('project', {
  id: uuid("id").primaryKey().defaultRandom(),
  status: text("status").notNull().default('active'),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const workspace = pgTable('workspace', {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: text("status").notNull().default('active'),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const projectMember = pgTable('project_member', {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(()=> user.id, { onDelete: "cascade" }),
  role: text("role").notNull().default('owner'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull()
}) 

export const event = pgTable('event', {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  icon: text("icon").default(''),
  event: text("event").notNull(),
  description: text("description"),
  metadata: jsonb("metadata").$type<{[x:string]: any}>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const subscriptionUsage = pgTable("subscription_usage", {
	id: uuid('id').primaryKey().defaultRandom(),
	subscriptionId: text("subscription_id").notNull().references(()=> subscription.id, { onDelete: 'cascade' }),
	events: integer('events').default(0).notNull(),
  lastEventAt: timestamp("last_event_at", { withTimezone: true }).defaultNow().notNull(),
  lastResetAt: timestamp("last_reset_at", { withTimezone: true }).defaultNow().notNull(),
})

export const pushSubscriptions = pgTable("push_subscriptions	", {
  id: uuid("id").primaryKey().defaultRandom(), 
  userId: text("user_id").notNull().references(()=> user.id, { onDelete: 'cascade' }),
  endpoint: text("endpoint").notNull(),
  keys: jsonb('keys').$type<{ auth: string, p256dh:string }>().notNull().default({ auth: '', p256dh: '' }),
  deviceId: text("device_id").notNull(),
  deviceInfo: jsonb('device_info').$type<{ userAgent: string, platform: string, browser: string, device: string }>().notNull().default({ userAgent: '', platform: '', browser: '', device: '' }),
  status: text("status").notNull().default('active'),
})

export const projectRelations = relations( project, ({ many }) => ({
  workspace: many( workspace ),
  members: many( projectMember ),
}))

export const eventRelations = relations( event, ({ one }) => ({
  workspace: one( workspace, {
    fields: [event.workspaceId],
    references: [workspace.id],
  }),
}))

export const workspaceRelations = relations( workspace, ({ one, many }) => ({
  project: one( project, {
    fields: [workspace.projectId],
    references: [project.id],
  }),
  events: many( event ),
}))

export const pushNotificationRelations = relations( pushSubscriptions, ({ one }) => ({
  user: one( user, {
    fields: [pushSubscriptions.userId],
    references: [user.id],
  }),
}))

export const subscriptionUsageRelations = relations( subscriptionUsage, ({ one }) => ({
  subscription: one( subscription, {
    fields: [subscriptionUsage.subscriptionId],
    references: [subscription.id],
  }),
}))