import { pgTable, text, serial, integer, boolean, timestamp, real, varchar, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const metrics = pgTable("metrics", {
  id: serial("id").primaryKey(),
  mrr: integer("mrr").notNull(),
  runway: integer("runway").notNull(),
  burnRate: integer("burn_rate").notNull(),
  activeUsers: integer("active_users").notNull(),
  cac: integer("cac").notNull(),
  ltv: integer("ltv").notNull(),
  churn: real("churn").notNull(),
  teamSize: integer("team_size").notNull(),
  openPositions: integer("open_positions").notNull(),
  cashBalance: integer("cash_balance").notNull(),
  lastFundraise: text("last_fundraise").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const updates = pgTable("updates", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  type: text("type").notNull(), // Monthly, Quarterly
  attachments: integer("attachments").default(0).notNull(),
  comments: integer("comments").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const stakeholders = pgTable("stakeholders", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(), // Founder, Investor, Options
  shares: integer("shares").notNull(),
  percentage: real("percentage").notNull(),
  securityType: text("security_type").notNull(),
  initials: text("initials").notNull(),
});

export const milestones = pgTable("milestones", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  status: text("status").notNull(), // Completed, In Progress, Planned
  amount: integer("amount"),
  investors: integer("investors"),
  icon: text("icon").notNull(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // Legal, Financial, Pitch
  type: text("type").notNull(), // pdf, excel, powerpoint
  date: timestamp("date").defaultNow().notNull(),
  url: text("url").notNull(), // Google Drive, OneDrive, etc. link
  source: text("source").notNull(), // Google Drive, OneDrive, Dropbox, etc.
});

export const asks = pgTable("asks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // Intros, Hiring, Advice
  urgency: text("urgency").notNull(), // High, Medium, Low
  responses: integer("responses").default(0).notNull(),
  views: integer("views").default(0).notNull(),
  icon: text("icon").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  askId: integer("ask_id").notNull(),
  author: text("author").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type", { length: 50 }).notNull().default("investor"), // "admin" or "investor"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMetricsSchema = createInsertSchema(metrics).omit({
  id: true,
  updatedAt: true,
});

export const insertUpdateSchema = createInsertSchema(updates).omit({
  id: true,
  attachments: true,
  comments: true,
  views: true,
  createdAt: true,
});

export const insertStakeholderSchema = createInsertSchema(stakeholders).omit({
  id: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  date: true,
});

export const insertAskSchema = createInsertSchema(asks).omit({
  id: true,
  responses: true,
  views: true,
  createdAt: true,
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  createdAt: true,
});

export const upsertUserSchema = createInsertSchema(users);

export type InsertMetrics = z.infer<typeof insertMetricsSchema>;
export type InsertUpdate = z.infer<typeof insertUpdateSchema>;
export type InsertStakeholder = z.infer<typeof insertStakeholderSchema>;
export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type InsertAsk = z.infer<typeof insertAskSchema>;
export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;

export type Metrics = typeof metrics.$inferSelect;
export type Update = typeof updates.$inferSelect;
export type Stakeholder = typeof stakeholders.$inferSelect;
export type Milestone = typeof milestones.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Ask = typeof asks.$inferSelect;
export type Response = typeof responses.$inferSelect;
export type User = typeof users.$inferSelect;
