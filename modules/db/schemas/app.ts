import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { apikey, user } from "./auth";

export const workspace = pgTable('workspace', {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: text("status").notNull().default('active'),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const workspaceMember = pgTable('workspace_member', {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
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
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

export const apiUsage = pgTable("api_usage", {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text("user_id").notNull().references(()=> user.id, { onDelete: 'cascade' }),
	events: integer('events').default(0).notNull(),
  renewAt: timestamp("renew_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

//Token Bucket Algorithm
export const apiKeyTokenBucket = pgTable("api_key_token_bucket", {
  id: uuid("id").primaryKey().defaultRandom(),
  apiKeyId: text("api_key_id").notNull().references(()=> apikey.id, { onDelete: 'cascade' }),
  capacity: integer("capacity").default(0).notNull(), // maximum number of tokens in the bucket
  remaining: integer("remaining").default(0).notNull(), // current number of tokens in the bucket
  refillInterval: integer("refill_interval").default(0).notNull(), // in milliseconds
  refillAmount: integer("refill_amount").default(0).notNull(), // number of tokens to add each interval 
  lastRefillAt: timestamp("last_refill_at", { withTimezone: true }).defaultNow().notNull(),
})

export const eventRelations = relations( event, ({ one }) => ({
  workspace: one( workspace, {
    fields: [event.workspaceId],
    references: [workspace.id],
  }),
}))

export const workspaceRelations = relations( workspace, ({ many }) => ({
  members: many( workspaceMember ),
  events: many( event ),
}))