import {
  users,
  projects,
  skills,
  achievements,
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Skill,
  type InsertSkill,
  type Achievement,
  type InsertAchievement,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User>;

  getProjectsByUserId(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: number): Promise<void>;

  getSkillsByUserId(userId: number): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;

  getAchievementsByUserId(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, achievement: Partial<InsertAchievement>): Promise<Achievement>;
  deleteAchievement(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    await db.insert(users).values(insertUser);
    const user = await this.getUserByUsername(insertUser.username);
    if (!user) throw new Error("Failed to fetch inserted user");
    return user;
  }

  async updateUser(id: number, updateUser: Partial<InsertUser>): Promise<User> {
    await db.update(users).set({ ...updateUser, updatedAt: new Date() }).where(eq(users.id, id));
    const user = await this.getUser(id);
    if (!user) throw new Error("Failed to fetch updated user");
    return user;
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.userId, userId)).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    await db.insert(projects).values(insertProject);
    const [project] = await db.select().from(projects).where(eq(projects.title, insertProject.title)).orderBy(desc(projects.createdAt));
    if (!project) throw new Error("Failed to fetch inserted project");
    return project;
  }

  async updateProject(id: number, updateProject: Partial<InsertProject>): Promise<Project> {
    await db.update(projects).set({ ...updateProject, updatedAt: new Date() }).where(eq(projects.id, id));
    const project = await this.getProject(id);
    if (!project) throw new Error("Failed to fetch updated project");
    return project;
  }

  async deleteProject(id: number): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  async getSkillsByUserId(userId: number): Promise<Skill[]> {
    return db.select().from(skills).where(eq(skills.userId, userId));
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    await db.insert(skills).values(insertSkill);
    const [skill] = await db.select().from(skills).where(eq(skills.name, insertSkill.name));
    if (!skill) throw new Error("Failed to fetch inserted skill");
    return skill;
  }

  async updateSkill(id: number, updateSkill: Partial<InsertSkill>): Promise<Skill> {
    await db.update(skills).set(updateSkill).where(eq(skills.id, id));
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    if (!skill) throw new Error("Failed to fetch updated skill");
    return skill;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  async getAchievementsByUserId(userId: number): Promise<Achievement[]> {
    return db.select().from(achievements).where(eq(achievements.userId, userId)).orderBy(desc(achievements.date));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    await db.insert(achievements).values(insertAchievement);
    const [achievement] = await db.select().from(achievements).where(eq(achievements.title, insertAchievement.title)).orderBy(desc(achievements.date));
    if (!achievement) throw new Error("Failed to fetch inserted achievement");
    return achievement;
  }

  async updateAchievement(id: number, updateAchievement: Partial<InsertAchievement>): Promise<Achievement> {
    await db.update(achievements).set(updateAchievement).where(eq(achievements.id, id));
    const [achievement] = await db.select().from(achievements).where(eq(achievements.id, id));
    if (!achievement) throw new Error("Failed to fetch updated achievement");
    return achievement;
  }

  async deleteAchievement(id: number): Promise<void> {
    await db.delete(achievements).where(eq(achievements.id, id));
  }
}

export const storage = new DatabaseStorage();
