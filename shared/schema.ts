import {
  mysqlTable,
  varchar,
  int,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 100 }),
  bio: text("bio"),
  location: varchar("location", { length: 100 }),
  website: varchar("website", { length: 255 }),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = mysqlTable("projects", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  category: varchar("category", { length: 50 }),
  technologies: text("technologies"),
  imageUrl: text("image_url"),
  projectUrl: text("project_url"),
  githubUrl: text("github_url"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const skills = mysqlTable("skills", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  name: varchar("name", { length: 100 }).notNull(),
  level: int("level").notNull(), // 1-100
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = mysqlTable("achievements", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull().references(() => users.id),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }),
  date: timestamp("date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  skills: many(skills),
  achievements: many(achievements),
}));

export const projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id],
  }),
}));

export const skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users, {
  id: z.undefined(),
  createdAt: z.undefined(),
  updatedAt: z.undefined(),
});

export const insertProjectSchema = createInsertSchema(projects, {
  id: z.undefined(),
  createdAt: z.undefined(),
  updatedAt: z.undefined(),
});

export const insertSkillSchema = createInsertSchema(skills, {
  id: z.undefined(),
  createdAt: z.undefined(),
});

export const insertAchievementSchema = createInsertSchema(achievements, {
  id: z.undefined(),
  createdAt: z.undefined(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Skill = typeof skills.$inferSelect;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
