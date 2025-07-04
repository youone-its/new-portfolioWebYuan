import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import { storage } from "./storage";
import { insertUserSchema, insertProjectSchema, insertSkillSchema, insertAchievementSchema } from "../shared/schema";
import bcrypt from "bcrypt";
import { z } from "zod";

declare module "express-session" {
  interface SessionData {
    userId: number;
  }
}

interface AuthenticatedRequest extends Request {
  session: session.Session & Partial<session.SessionData> & { userId: number };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  }));

  // Auth middleware
  const requireAuth = (req: Request, res: any, next: any) => {
    if (!req.session?.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log("[REGISTER] Request body:", req.body);
      const validatedData = insertUserSchema
        .extend({
          email: z.string().email(),
          password: z.string().min(6),
        })
        .strict()
        .parse(req.body);


      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Set session
      req.session.userId = user.id;
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // User routes
  app.put("/api/users/profile", requireAuth, async (req, res) => {
    try {
      const validatedData = insertUserSchema.partial().parse(req.body);
      const userId = req.session.userId!;
      const user = await storage.updateUser(userId, validatedData);
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // Project routes
  app.get("/api/projects", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId,
      });
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Failed to create project" });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const userId = req.session.userId!;
      
      // Check if project belongs to user
      const existingProject = await storage.getProject(projectId);
      if (!existingProject || existingProject.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const project = await storage.updateProject(projectId, validatedData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: "Failed to update project" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const userId = req.session.userId!;
      
      // Check if project belongs to user
      const existingProject = await storage.getProject(projectId);
      if (!existingProject || existingProject.userId !== userId) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      await storage.deleteProject(projectId);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete project" });
    }
  });

  // Skills routes
  app.get("/api/skills", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const skills = await storage.getSkillsByUserId(userId);
      res.json(skills);
    } catch (error) {
      res.status(500).json({ message: "Failed to get skills" });
    }
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const validatedData = insertSkillSchema.parse({
        ...req.body,
        userId,
      });
      const skill = await storage.createSkill(validatedData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Failed to create skill" });
    }
  });

  app.put("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(skillId, validatedData);
      res.json(skill);
    } catch (error) {
      res.status(400).json({ message: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const skillId = parseInt(req.params.id);
      await storage.deleteSkill(skillId);
      res.json({ message: "Skill deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete skill" });
    }
  });

  // Achievements routes
  app.get("/api/achievements", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const achievements = await storage.getAchievementsByUserId(userId);
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  app.post("/api/achievements", requireAuth, async (req, res) => {
    try {
      const validatedData = insertAchievementSchema.parse({
        ...req.body,
        userId: req.session.userId,
      });
      const achievement = await storage.createAchievement(validatedData);
      res.json(achievement);
    } catch (error) {
      res.status(400).json({ message: "Failed to create achievement" });
    }
  });

  app.put("/api/achievements/:id", requireAuth, async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const validatedData = insertAchievementSchema.partial().parse(req.body);
      const achievement = await storage.updateAchievement(achievementId, validatedData);
      res.json(achievement);
    } catch (error) {
      res.status(400).json({ message: "Failed to update achievement" });
    }
  });

  app.delete("/api/achievements/:id", requireAuth, async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      await storage.deleteAchievement(achievementId);
      res.json({ message: "Achievement deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: "Failed to delete achievement" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const [projects, skills, achievements] = await Promise.all([
        storage.getProjectsByUserId(userId),
        storage.getSkillsByUserId(userId),
        storage.getAchievementsByUserId(userId),
      ]);

      const stats = {
        projects: projects.length,
        skills: skills.length,
        achievements: achievements.length,
        views: 0, // This would typically come from analytics
        stars: 0, // This would typically come from GitHub API
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
